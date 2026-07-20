import json
import os
import time
from pathlib import Path

import google.generativeai as genai
from pymongo import MongoClient

# Ortam değişkenlerinden konfigürasyon
MONGO_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("MONGO_DB_NAME", "islamapp")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("UYARI: GEMINI_API_KEY ortam değişkeni tanımlı değil. .env veya Render ayarlarını kontrol et.")

genai.configure(api_key=GEMINI_API_KEY)


def _connect_db():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    return db


def generate_questions(category, count=10, insert=True):
    """Gemini ile `count` adet soru üretir ve (varsayılan) veritabanına kaydeder.

    Dönen yapı: liste halinde soru dict'leri veya None hata durumunda.
    """
    print(f"{category} kategorisinde {count} soru üretiliyor...")

    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""
Sen uzman bir İslami İlimler hocasısın. Bana '{category}' kategorisinde {count} adet zorlayıcı, eğitici ve kesinlikle doğru bilgiler içeren çoktan seçmeli quiz sorusu üret.

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:
[
  {{
    "question": "Soru metni",
    "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
    "correct_index": 1,
    "difficulty": "medium",
    "points": 10,
    "explanation": "Cevabın neden doğru olduğuna dair 1-2 cümlelik açıklama",
    "category": "{category}"
  }}
]
"""

    try:
        response = model.generate_content(prompt)
        # Bazı modeller yanıtı ```json blokları ile dönebilir, temizleyelim
        response_text = response.text
        response_text = response_text.replace('```json', '').replace('```', '').strip()

        questions = json.loads(response_text)

        # Basit doğrulama: dizi ve iç öğeler dict olmalı
        if not isinstance(questions, list) or not all(isinstance(q, dict) for q in questions):
            raise ValueError('Beklenmeyen JSON formatı')

        if insert:
            db = _connect_db()
            coll = db.get_collection("quiz_questions")
            # Zaman damgası ekle
            ts = int(time.time())
            for q in questions:
                q.setdefault("created_at", ts)
            coll.insert_many(questions)

        print(f"Başarıyla {len(questions)} soru üretildi{(' ve kaydedildi' if insert else '')}!")
        return questions

    except Exception as e:
        print(f"Soru üretilirken hata oluştu: {e}")
        return None


if __name__ == "__main__":
    # Hızlı kullanım: python ai_quiz_generator.py "Siyer" 5
    import sys

    if len(sys.argv) >= 3:
        category = sys.argv[1]
        try:
            count = int(sys.argv[2])
        except Exception:
            count = 10
    else:
        category = "Siyer ve Peygamberler Tarihi"
        count = 5

    generate_questions(category, count)
