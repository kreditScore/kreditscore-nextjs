import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = join(process.cwd(), 'lib', 'bank_companies.db');

async function openDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const bank = searchParams.get('bank')?.trim() || '';
  const cat = searchParams.get('cat')?.trim() || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const perPage = 50;

  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (q) {
    conditions.push('UPPER(company) LIKE ?');
    params.push(`%${q.toUpperCase()}%`);
  }
  if (bank) {
    conditions.push('UPPER(bank) = ?');
    params.push(bank.toUpperCase());
  }
  if (cat) {
    conditions.push('UPPER(category) LIKE ?');
    params.push(`%${cat.toUpperCase()}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * perPage;

  const db = await openDb();
  const totalResult = await db.get<{ count: number }>(`SELECT COUNT(*) as count FROM companies ${where}`, params);
  const rows = await db.all(
    `SELECT company, bank, category, segment FROM companies ${where} ORDER BY company LIMIT ? OFFSET ?`,
    ...params,
    perPage,
    offset
  );
  await db.close();

  return NextResponse.json({
    total: totalResult?.count ?? 0,
    page,
    per_page: perPage,
    results: rows,
  });
}
