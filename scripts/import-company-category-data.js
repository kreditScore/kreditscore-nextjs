const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const sourceDir = process.argv[2] || path.join(process.env.USERPROFILE || '', 'Desktop', 'COMPANY LIST');
const outputFile = path.join(process.cwd(), 'lib', 'companycatogorylistdata.ts');

const validExtensions = ['.xlsx', '.xls', '.xlsb'];

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function guessField(headers, row) {
  const normalizedHeaders = headers.map((h) => normalizeHeader(h));
  const lowerRow = row;
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
    rows.push(...parsed);
    console.log(`Parsed ${parsed.length} rows from ${file}`);
  }

  return rows;
}

function uniqueCompanies(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.name.trim().toLowerCase();
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        name: row.name.trim(),
        category: row.category.trim() || 'Unknown',
        details: row.details.trim() || undefined
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function buildTsFile(companies) {
  const lines = [];
  lines.push('export interface CompanyRecord {');
  lines.push('  name: string;');
  lines.push('  category: string;');
  lines.push('  details?: string;');
  lines.push('}');
  lines.push('');
  lines.push('export const companyCategoryListData: CompanyRecord[] = [');
  for (const item of companies) {
    const detailsLine = item.details ? `, details: ${JSON.stringify(item.details)}` : '';
    lines.push(`  { name: ${JSON.stringify(item.name)}, category: ${JSON.stringify(item.category)}${detailsLine} },`);
  }
  lines.push('];');

  return lines.join('\n');
}

function main() {
  try {
    console.log(`Loading Excel files from: ${sourceDir}`);
    const rows = loadFiles(sourceDir);
    const companies = uniqueCompanies(rows);
    const tsContent = buildTsFile(companies);
    fs.writeFileSync(outputFile, tsContent, 'utf8');
    console.log(`Wrote ${companies.length} companies to ${outputFile}`);
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
