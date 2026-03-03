from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, date
import math
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# City Model
class City(BaseModel):
    id: str
    name: str
    country: str
    latitude: float
    longitude: float
    timezone: str
    qibla_direction: float

# Prayer Times
class PrayerTimes(BaseModel):
    city_id: str
    date: str
    fajr: str
    sunrise: str
    dhuhr: str
    asr: str
    maghrib: str
    isha: str

# AI Chat
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

# Pomodoro Session
class PomodoroSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    topic: str
    duration_minutes: int
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PomodoroCreate(BaseModel):
    user_id: str
    topic: str
    duration_minutes: int

class PomodoroUpdate(BaseModel):
    completed: bool

# User Preferences
class UserPreferences(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    city_id: str = "istanbul"
    madhab: str = "hanafi"
    language: str = "tr"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserPreferencesCreate(BaseModel):
    user_id: str
    city_id: str = "istanbul"
    madhab: str = "hanafi"
    language: str = "tr"

# ===================== TURKISH CITIES DATA =====================

TURKISH_CITIES = [
    {"id": "istanbul", "name": "İstanbul", "country": "Türkiye", "latitude": 41.0082, "longitude": 28.9784, "timezone": "Europe/Istanbul", "qibla_direction": 149.67},
    {"id": "ankara", "name": "Ankara", "country": "Türkiye", "latitude": 39.9334, "longitude": 32.8597, "timezone": "Europe/Istanbul", "qibla_direction": 152.47},
    {"id": "izmir", "name": "İzmir", "country": "Türkiye", "latitude": 38.4192, "longitude": 27.1287, "timezone": "Europe/Istanbul", "qibla_direction": 145.23},
    {"id": "bursa", "name": "Bursa", "country": "Türkiye", "latitude": 40.1885, "longitude": 29.0610, "timezone": "Europe/Istanbul", "qibla_direction": 148.87},
    {"id": "antalya", "name": "Antalya", "country": "Türkiye", "latitude": 36.8841, "longitude": 30.7056, "timezone": "Europe/Istanbul", "qibla_direction": 150.65},
    {"id": "adana", "name": "Adana", "country": "Türkiye", "latitude": 37.0000, "longitude": 35.3213, "timezone": "Europe/Istanbul", "qibla_direction": 159.21},
    {"id": "konya", "name": "Konya", "country": "Türkiye", "latitude": 37.8746, "longitude": 32.4932, "timezone": "Europe/Istanbul", "qibla_direction": 154.87},
    {"id": "gaziantep", "name": "Gaziantep", "country": "Türkiye", "latitude": 37.0662, "longitude": 37.3833, "timezone": "Europe/Istanbul", "qibla_direction": 165.32},
    {"id": "kayseri", "name": "Kayseri", "country": "Türkiye", "latitude": 38.7312, "longitude": 35.4787, "timezone": "Europe/Istanbul", "qibla_direction": 159.78},
    {"id": "samsun", "name": "Samsun", "country": "Türkiye", "latitude": 41.2867, "longitude": 36.3300, "timezone": "Europe/Istanbul", "qibla_direction": 161.45},
    {"id": "trabzon", "name": "Trabzon", "country": "Türkiye", "latitude": 41.0027, "longitude": 39.7168, "timezone": "Europe/Istanbul", "qibla_direction": 168.92},
    {"id": "eskisehir", "name": "Eskişehir", "country": "Türkiye", "latitude": 39.7767, "longitude": 30.5206, "timezone": "Europe/Istanbul", "qibla_direction": 150.34},
    {"id": "diyarbakir", "name": "Diyarbakır", "country": "Türkiye", "latitude": 37.9144, "longitude": 40.2306, "timezone": "Europe/Istanbul", "qibla_direction": 171.56},
    {"id": "erzurum", "name": "Erzurum", "country": "Türkiye", "latitude": 39.9055, "longitude": 41.2658, "timezone": "Europe/Istanbul", "qibla_direction": 175.23},
    {"id": "mersin", "name": "Mersin", "country": "Türkiye", "latitude": 36.8121, "longitude": 34.6415, "timezone": "Europe/Istanbul", "qibla_direction": 156.87},
]

# ===================== PRAYER TIME CALCULATION =====================

def calculate_prayer_times(latitude: float, longitude: float, date_obj: date, madhab: str = "hanafi") -> dict:
    """Calculate prayer times using Diyanet method for Turkey"""
    import math
    
    # Day of year
    day_of_year = date_obj.timetuple().tm_yday
    
    # Equation of time and declination
    B = 2 * math.pi * (day_of_year - 81) / 365
    equation_of_time = 9.87 * math.sin(2 * B) - 7.53 * math.cos(B) - 1.5 * math.sin(B)
    declination = 23.45 * math.sin(2 * math.pi * (day_of_year - 81) / 365)
    
    # Solar noon
    timezone_offset = 3  # Turkey timezone (UTC+3)
    solar_noon = 12 - equation_of_time / 60 - longitude / 15 + timezone_offset
    
    # Convert to radians
    lat_rad = math.radians(latitude)
    dec_rad = math.radians(declination)
    
    # Calculate times
    def time_for_angle(angle):
        angle_rad = math.radians(angle)
        cos_hour_angle = (math.sin(angle_rad) - math.sin(lat_rad) * math.sin(dec_rad)) / (math.cos(lat_rad) * math.cos(dec_rad))
        if cos_hour_angle > 1 or cos_hour_angle < -1:
            return None
        hour_angle = math.degrees(math.acos(cos_hour_angle)) / 15
        return hour_angle
    
    # Fajr - 18 degrees below horizon (Diyanet method)
    fajr_angle = time_for_angle(-18)
    fajr = solar_noon - fajr_angle if fajr_angle else solar_noon - 1.5
    
    # Sunrise - 0.833 degrees for refraction
    sunrise_angle = time_for_angle(-0.833)
    sunrise = solar_noon - sunrise_angle if sunrise_angle else solar_noon - 0.5
    
    # Dhuhr - solar noon + 5 minutes safety margin
    dhuhr = solar_noon + 0.083
    
    # Asr - Hanafi: shadow = 2x object + noon shadow, Shafi: shadow = 1x object + noon shadow
    if madhab == "hanafi":
        asr_shadow_ratio = 2
    else:
        asr_shadow_ratio = 1
    
    asr_altitude = math.degrees(math.atan(1 / (asr_shadow_ratio + math.tan(lat_rad - dec_rad))))
    asr_angle = time_for_angle(asr_altitude)
    asr = solar_noon + asr_angle if asr_angle else solar_noon + 3
    
    # Maghrib - sunset + safety margin
    maghrib_angle = time_for_angle(-0.833)
    maghrib = solar_noon + maghrib_angle + 0.05 if maghrib_angle else solar_noon + 6
    
    # Isha - 17 degrees below horizon (Diyanet method)
    isha_angle = time_for_angle(-17)
    isha = solar_noon + isha_angle if isha_angle else maghrib + 1.5
    
    def format_time(hours):
        hours = hours % 24
        h = int(hours)
        m = int((hours - h) * 60)
        return f"{h:02d}:{m:02d}"
    
    return {
        "fajr": format_time(fajr),
        "sunrise": format_time(sunrise),
        "dhuhr": format_time(dhuhr),
        "asr": format_time(asr),
        "maghrib": format_time(maghrib),
        "isha": format_time(isha)
    }

# ===================== ROUTES =====================

@api_router.get("/")
async def root():
    return {"message": "İslami Yaşam Asistanı API", "version": "1.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Cities
@api_router.get("/cities", response_model=List[City])
async def get_cities():
    return [City(**city) for city in TURKISH_CITIES]

@api_router.get("/cities/{city_id}", response_model=City)
async def get_city(city_id: str):
    for city in TURKISH_CITIES:
        if city["id"] == city_id:
            return City(**city)
    raise HTTPException(status_code=404, detail="City not found")

# Prayer Times
@api_router.get("/prayer-times/{city_id}")
async def get_prayer_times(city_id: str, madhab: str = "hanafi"):
    city = None
    for c in TURKISH_CITIES:
        if c["id"] == city_id:
            city = c
            break
    
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    today = date.today()
    times = calculate_prayer_times(city["latitude"], city["longitude"], today, madhab)
    
    return {
        "city_id": city_id,
        "city_name": city["name"],
        "date": today.isoformat(),
        "qibla_direction": city["qibla_direction"],
        **times
    }

# AI Chat
@api_router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    try:
        # Store user message
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        await db.chat_messages.insert_one(user_msg.dict())
        
        # Get chat history for context
        history = await db.chat_messages.find(
            {"session_id": request.session_id}
        ).sort("timestamp", 1).to_list(20)
        
        # Build context from history
        context = ""
        for msg in history[-10:]:
            role = "Kullanıcı" if msg["role"] == "user" else "Asistan"
            context += f"{role}: {msg['content']}\n"
        
        # System message for Islamic knowledge assistant
        system_message = """Sen bir İslami bilgi asistanısın. Türkçe olarak cevap ver.
        
Görevlerin:
1. Kur'an ayetleri, hadisler ve fıkıh konularında bilgi ver
2. Farklı âlimlerin görüşlerini karşılaştır (Diyanet, Elmalılı Hamdi Yazır, Ömer Nasuhi Bilmen, vs.)
3. Kaynaklarını belirt
4. Dini konularda nazik ve saygılı ol
5. Tartışmalı konularda farklı görüşleri sun
6. Namaz, oruç, zekat gibi ibadet konularında yardımcı ol

Önemli: Her zaman güvenilir kaynaklara başvur ve fetva verme, sadece bilgi paylaş. Kullanıcıyı daha fazla araştırmaya teşvik et.

Mevcut sohbet geçmişi:
""" + context
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"islamic_assistant_{request.session_id}",
            system_message=system_message
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        # Send message and get response
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Store assistant response
        assistant_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=response
        )
        await db.chat_messages.insert_one(assistant_msg.dict())
        
        return ChatResponse(response=response, session_id=request.session_id)
        
    except Exception as e:
        logger.error(f"AI Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@api_router.get("/ai/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id}
    ).sort("timestamp", 1).to_list(100)
    
    return [{"role": msg["role"], "content": msg["content"], "timestamp": msg["timestamp"]} for msg in messages]

@api_router.delete("/ai/history/{session_id}")
async def clear_chat_history(session_id: str):
    result = await db.chat_messages.delete_many({"session_id": session_id})
    return {"deleted_count": result.deleted_count}

# Pomodoro Sessions
@api_router.post("/pomodoro", response_model=PomodoroSession)
async def create_pomodoro_session(session: PomodoroCreate):
    session_obj = PomodoroSession(**session.dict())
    await db.pomodoro_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/pomodoro/{user_id}")
async def get_pomodoro_sessions(user_id: str):
    sessions = await db.pomodoro_sessions.find(
        {"user_id": user_id}
    ).sort("created_at", -1).to_list(50)
    return [PomodoroSession(**s) for s in sessions]

@api_router.patch("/pomodoro/{session_id}")
async def update_pomodoro_session(session_id: str, update: PomodoroUpdate):
    result = await db.pomodoro_sessions.update_one(
        {"id": session_id},
        {"$set": update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@api_router.get("/pomodoro/stats/{user_id}")
async def get_pomodoro_stats(user_id: str):
    sessions = await db.pomodoro_sessions.find({"user_id": user_id}).to_list(1000)
    
    total_sessions = len(sessions)
    completed_sessions = sum(1 for s in sessions if s.get("completed", False))
    total_minutes = sum(s.get("duration_minutes", 0) for s in sessions if s.get("completed", False))
    
    # Group by topic
    topics = {}
    for s in sessions:
        topic = s.get("topic", "Diğer")
        if topic not in topics:
            topics[topic] = {"count": 0, "minutes": 0}
        topics[topic]["count"] += 1
        if s.get("completed", False):
            topics[topic]["minutes"] += s.get("duration_minutes", 0)
    
    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "total_minutes": total_minutes,
        "topics": topics
    }

# User Preferences
@api_router.post("/preferences", response_model=UserPreferences)
async def create_or_update_preferences(prefs: UserPreferencesCreate):
    existing = await db.user_preferences.find_one({"user_id": prefs.user_id})
    
    if existing:
        await db.user_preferences.update_one(
            {"user_id": prefs.user_id},
            {"$set": {**prefs.dict(), "updated_at": datetime.utcnow()}}
        )
        updated = await db.user_preferences.find_one({"user_id": prefs.user_id})
        return UserPreferences(**updated)
    else:
        prefs_obj = UserPreferences(**prefs.dict())
        await db.user_preferences.insert_one(prefs_obj.dict())
        return prefs_obj

@api_router.get("/preferences/{user_id}", response_model=UserPreferences)
async def get_preferences(user_id: str):
    prefs = await db.user_preferences.find_one({"user_id": user_id})
    if not prefs:
        # Return default preferences
        return UserPreferences(user_id=user_id)
    return UserPreferences(**prefs)

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
