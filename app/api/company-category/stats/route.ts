import { NextResponse } from 'next/server';
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

export async function GET() {
  const db = await openDb();
  const totalResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM companies');
  const banks = await db.all<{ bank: string; cnt: number }>(
    'SELECT bank, COUNT(*) as cnt FROM companies GROUP BY bank ORDER BY cnt DESC'
  );
  await db.close();

  return NextResponse.json({
    total: totalResult?.count ?? 0,
    banks,
  });
}
