from flask import Flask, jsonify, request, send_from_directory
import sqlite3, os

app = Flask(__name__, static_folder='.')
DB = os.path.join(os.path.dirname(__file__), 'bank_companies.db')

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/search')
def search():
    q = request.args.get('q', '').strip()
    bank = request.args.get('bank', '').strip()
    cat = request.args.get('cat', '').strip()
    seg = request.args.get('seg', '').strip()
    page = int(request.args.get('page', 1))
    per_page = 50

    conditions = []
    params = []

    if q:
        conditions.append("company LIKE ?")
        params.append(f"%{q.upper()}%")
    if bank:
        conditions.append("bank = ?")
        params.append(bank)
    if cat:
        conditions.append("category LIKE ?")
        params.append(f"%{cat}%")
    if seg and seg != '—':
        conditions.append("segment = ?")
        params.append(seg)

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    offset = (page - 1) * per_page

    conn = get_db()
    total = conn.execute(f"SELECT COUNT(*) FROM companies {where}", params).fetchone()[0]
    rows = conn.execute(
        f"SELECT company, bank, category, segment FROM companies {where} ORDER BY company LIMIT ? OFFSET ?",
        params + [per_page, offset]
    ).fetchall()
    conn.close()

    return jsonify({
        "total": total,
        "page": page,
        "per_page": per_page,
        "results": [dict(r) for r in rows]
    })

@app.route('/api/stats')
def stats():
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM companies").fetchone()[0]
    banks = conn.execute("SELECT bank, COUNT(*) as cnt FROM companies GROUP BY bank ORDER BY cnt DESC").fetchall()
    cats = conn.execute("SELECT category, COUNT(*) as cnt FROM companies WHERE category != '' GROUP BY category ORDER BY cnt DESC LIMIT 15").fetchall()
    conn.close()
    return jsonify({
        "total": total,
        "banks": [dict(r) for r in banks],
        "categories": [dict(r) for r in cats]
    })

@app.route('/api/banks')
def banks():
    conn = get_db()
    rows = conn.execute("SELECT DISTINCT bank FROM companies ORDER BY bank").fetchall()
    conn.close()
    return jsonify([r['bank'] for r in rows])

if __name__ == '__main__':
    print("\n✅ Bank Database Server chal raha hai!")
    print("🌐 Browser mein kholo: http://localhost:5000\n")
    app.run(debug=False, port=5000)
