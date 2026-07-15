import json
import sqlite3
import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
DB_PATH = os.path.join(os.path.dirname(__file__), "questionnaire.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            birth_date TEXT,
            height REAL,
            weight REAL,
            gender TEXT,
            created_at TEXT DEFAULT (datetime('now','localtime'))
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            answers TEXT NOT NULL,
            submitted_at TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    """)
    conn.commit()
    conn.close()

init_db()

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

@app.get("/", response_class=HTMLResponse)
async def patient_page():
    with open(os.path.join(os.path.dirname(__file__), "static", "patient.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/admin", response_class=HTMLResponse)
async def admin_page():
    with open(os.path.join(os.path.dirname(__file__), "static", "admin.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/patient")
async def register_patient(request: Request):
    data = await request.json()
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO patients (name, phone, birth_date, height, weight, gender) VALUES (?, ?, ?, ?, ?, ?)",
        (data["name"], data["phone"], data.get("birth_date"), data.get("height"), data.get("weight"), data.get("gender"))
    )
    patient_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": patient_id}

@app.post("/api/submit")
async def submit_response(request: Request):
    data = await request.json()
    conn = get_db()
    conn.execute(
        "INSERT INTO responses (patient_id, answers) VALUES (?, ?)",
        (data["patient_id"], json.dumps(data["answers"], ensure_ascii=False))
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.get("/api/responses")
async def get_responses():
    conn = get_db()
    rows = conn.execute("""
        SELECT p.id as patient_id, p.name, p.phone, p.birth_date, p.height, p.weight, p.gender, p.created_at,
               r.answers, r.submitted_at
        FROM patients p
        LEFT JOIN responses r ON p.id = r.patient_id
        ORDER BY r.submitted_at DESC
    """).fetchall()
    conn.close()
    results = []
    for row in rows:
        results.append({
            "patient_id": row["patient_id"],
            "name": row["name"],
            "phone": row["phone"],
            "birth_date": row["birth_date"],
            "height": row["height"],
            "weight": row["weight"],
            "gender": row["gender"],
            "created_at": row["created_at"],
            "answers": json.loads(row["answers"]) if row["answers"] else None,
            "submitted_at": row["submitted_at"]
        })
    return results

@app.get("/api/response/{patient_id}")
async def get_patient_response(patient_id: int):
    conn = get_db()
    patient = conn.execute("SELECT * FROM patients WHERE id = ?", (patient_id,)).fetchone()
    response = conn.execute("SELECT * FROM responses WHERE patient_id = ? ORDER BY submitted_at DESC LIMIT 1", (patient_id,)).fetchone()
    conn.close()
    if not patient:
        return JSONResponse(status_code=404, content={"error": "not found"})
    return {
        "patient": dict(patient),
        "answers": json.loads(response["answers"]) if response else None,
        "submitted_at": response["submitted_at"] if response else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
