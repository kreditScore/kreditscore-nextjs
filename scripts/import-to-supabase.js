#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const source = argv._[0] || process.env.SOURCE_DIR || path.join(process.env.USERPROFILE || '', 'Desktop', 'COMPANY LIST');
const providerArg = argv.provider || argv.p || null;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const validExtensions = ['.xlsx', '.xls', '.xlsb'];

function normalizeName(n) {
  return String(n || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '');
}

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function guessField(headers, row) {
  const normalizedHeaders = headers.map((h) => normalizeHeader(h));
  const nameIndex = normalizedHeaders.findIndex((h) => /company|name|employer|vendor|borrower/.test(h));
  const categoryIndex = normalizedHeaders.findIndex((h) => /category|segment|sector|type|business/.test(h));
  const detailsIndex = normalizedHeaders.findIndex((h) => /details|notes|description|remarks/.test(h));

  return {
    name: nameIndex >= 0 ? String(row[headers[nameIndex]] || '').trim() : '',
    category: categoryIndex >= 0 ? String(row[headers[categoryIndex]] || '').trim() : '',
    details: detailsIndex >= 0 ? String(row[headers[detailsIndex]] || '').trim() : ''
  };
}

function parseSheet(sheet) {
  const raw = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  if (raw.length === 0) return [];
  const headers = Object.keys(raw[0]);
  const results = raw
    .map((row) => guessField(headers, row))
    .filter((item) => item.name);
  return results;
}

function loadFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Source directory not found: ${directory}`);
  }

  const files = fs.readdirSync(directory).filter((file) => validExtensions.includes(path.extname(file).toLowerCase()));
  if (files.length === 0) {
    throw new Error(`No Excel files found in ${directory}`);
  }

  const rows = [];
  for (const file of files) {
    const filePath = path.join(directory, file);
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    if (sheetNames.length === 0) continue;
    const sheet = workbook.Sheets[sheetNames[0]];
    const parsed = parseSheet(sheet);
    parsed.forEach((p) => (p._source = file));
    rows.push(...parsed);
    console.log(`Parsed ${parsed.length} rows from ${file}`);
  }

  return rows;
}

function uniqueCompanies(rows, provider) {
  const map = new Map();
  for (const row of rows) {
    const key = normalizeName(row.name);
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        provider,
        name: row.name.trim(),
        name_normalized: key,
        category: row.category.trim() || 'Unknown',
        details: row.details.trim() || null,
        source_filename: row._source || null
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function replaceProviderData(provider, rows) {
  console.log(`Replacing entries for provider: ${provider}. Deleting old rows...`);
  const del = await supabase.from('company_category_list').delete().eq('provider', provider);
  if (del.error) {
    console.error('Error deleting existing rows:', del.error);
    process.exit(1);
  }
  console.log('Deleted existing rows for provider. Inserting new rows...');

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.from('company_category_list').insert(batch);
    if (error) {
      console.error('Insert error:', error);
      process.exit(1);
    }
    console.log(`Inserted ${batch.length} rows (batch ${(i / batchSize) + 1})`);
  }

  console.log(`Finished import for ${provider}, total rows: ${rows.length}`);
}

async function main() {
  try {
    const files = fs.readdirSync(source).filter((file) => validExtensions.includes(path.extname(file).toLowerCase()));
    if (files.length === 0) {
      console.error('No files found in source:', source);
      process.exit(1);
    }

    // If provider passed explicitly, process only matching files or all files but use provided provider
    const provider = providerArg || null;

    // Load all rows from folder
    const allRows = loadFiles(source);

    // Group rows by inferred provider (from filename) unless providerArg provided
    const groups = new Map();

    for (const r of allRows) {
      const inferred = provider || path.basename(r._source).split(/[\-_. ]/)[0] || 'unknown';
      const providerName = String(inferred).trim();
      if (!groups.has(providerName)) groups.set(providerName, []);
      groups.get(providerName).push(r);
    }

    for (const [prov, rows] of groups.entries()) {
      const unique = uniqueCompanies(rows, prov);
      await replaceProviderData(prov, unique);
    }

    console.log('All done.');
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
