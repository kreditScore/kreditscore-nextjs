#!/usr/bin/env python3
"""
migrate_to_supabase.py
======================
Migrates ALL data from local SQLite (bank_companies.db) to Supabase PostgreSQL.

Usage:
    pip install supabase python-dotenv
    python migrate_to_supabase.py

Env vars needed in .env.local:
    NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=eyJ...
"""

import os
import sqlite3
import sys
import time
from dotenv import load_dotenv

# Load .env.local
load_dotenv(dotenv_path=".env.local")
load_dotenv()  # fallback to .env

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
DB_PATH      = os.path.join("lib", "bank_companies.db")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Run: pip install supabase python-dotenv")
    sys.exit(1)


def get_sqlite_tables(conn: sqlite3.Connection) -> list[str]:
    cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    return [row[0] for row in cur.fetchall()]


def get_sqlite_columns(conn: sqlite3.Connection, table: str) -> list[str]:
    cur = conn.execute(f"PRAGMA table_info({table})")
    return [row[1] for row in cur.fetchall()]


def migrate_companies(conn: sqlite3.Connection, sb: "Client", batch_size: int = 500):
    """Migrate the companies table from SQLite → Supabase."""
    print("\n📦 Migrating companies table...")

    cols = get_sqlite_columns(conn, "companies")
    print(f"   Columns: {cols}")

    cur = conn.execute("SELECT COUNT(*) FROM companies")
    total = cur.fetchone()[0]
    print(f"   Total rows: {total:,}")

    if total == 0:
        print("   ⚠️  No data found in companies table.")
        return

    cur = conn.execute("SELECT * FROM companies")
    rows = cur.fetchall()

    inserted = 0
    errors   = 0
    batches  = (len(rows) + batch_size - 1) // batch_size

    for i in range(batches):
        batch = rows[i * batch_size : (i + 1) * batch_size]
        records = []
        for row in batch:
            record = dict(zip(cols, row))
            # Remove SQLite-only columns if any, normalize keys
            clean = {}
            for k, v in record.items():
                if k.lower() in ("id",):
                    continue  # let Supabase auto-generate id
                clean[k.lower()] = v if v is not None else None
            records.append(clean)

        try:
            result = sb.table("companies").upsert(records, on_conflict="company,bank").execute()
            inserted += len(batch)
            progress = (i + 1) / batches * 100
            print(f"   ✅ Batch {i+1}/{batches} ({progress:.0f}%) — {inserted:,} rows done", end="\r")
        except Exception as e:
            errors += len(batch)
            print(f"\n   ❌ Batch {i+1} failed: {e}")

        # Small delay to avoid rate limits
        time.sleep(0.05)

    print(f"\n   ✅ Companies migration done: {inserted:,} inserted, {errors} errors")


def verify_migration(sb: "Client"):
    """Verify row counts in Supabase after migration."""
    print("\n🔍 Verifying Supabase data...")
    try:
        result = sb.table("companies").select("*", count="exact", head=True).execute()
        count = result.count or 0
        print(f"   companies table: {count:,} rows in Supabase")
    except Exception as e:
        print(f"   ❌ Verification failed: {e}")


def check_supabase_table(sb: "Client"):
    """Check if companies table exists in Supabase."""
    try:
        result = sb.table("companies").select("id").limit(1).execute()
        print("   ✅ companies table exists in Supabase")
        return True
    except Exception as e:
        print(f"   ❌ companies table not found: {e}")
        print("   💡 Run sql/companies.sql in Supabase SQL Editor first!")
        return False


def main():
    print("=" * 55)
    print("  KreditScore → Supabase Migration Script")
    print("=" * 55)
    print(f"\n🔗 Supabase URL: {SUPABASE_URL}")
    print(f"📂 SQLite DB:    {DB_PATH}")

    # Check SQLite DB exists
    if not os.path.exists(DB_PATH):
        print(f"\n❌ SQLite DB not found at: {DB_PATH}")
        print("   Make sure you run this from the project root directory.")
        sys.exit(1)

    # Connect to SQLite
    print("\n📖 Opening SQLite database...")
    conn = sqlite3.connect(DB_PATH)
    tables = get_sqlite_tables(conn)
    print(f"   Tables found: {tables}")

    # Connect to Supabase
    print("\n🔗 Connecting to Supabase...")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Verify table exists
    if not check_supabase_table(sb):
        conn.close()
        sys.exit(1)

    # Run migrations
    if "companies" in tables:
        migrate_companies(conn, sb)
    else:
        print(f"\n⚠️  No 'companies' table in SQLite. Found: {tables}")

    # Verify
    verify_migration(sb)

    conn.close()
    print("\n🎉 Migration complete!")
    print("\nNext steps:")
    print("  1. Check Supabase Table Editor to verify data")
    print("  2. Remove bank_companies.db from your machine (already in .gitignore)")
    print("  3. Set env vars in Vercel: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY")


if __name__ == "__main__":
    main()
