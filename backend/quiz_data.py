# Quiz System v2 - 300+ Questions, Leaderboard, Trivia Crack Style
import json
import os
import random
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional
from pydantic import BaseModel, Field

# Load questions from JSON
QUIZ_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "quiz_questions.json")
with open(QUIZ_DATA_PATH, "r", encoding="utf-8") as f:
    _raw = json.load(f)

QUIZ_CATEGORIES = _raw["categories"]
ALL_QUESTIONS = _raw["questions"]

# Models
class QuizCategory(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    desc: str
    question_count: int = 0

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    source: str
    difficulty: str = "medium"
    points: int = 10

class QuizRoom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    host_id: str
    host_name: str
    players: List[Dict] = []
    status: str = "waiting"
    current_question: int = 0
    questions: List[Dict] = []
    max_players: int = 4
    question_count: int = 10
    time_per_question: int = 20
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

class QuizAnswer(BaseModel):
    room_id: str
    user_id: str
    question_index: int
    answer: int
    time_taken: float

class CreateRoomRequest(BaseModel):
    user_id: str
    username: str
    category: str
    room_name: str
    question_count: int = 10
    time_per_question: int = 20

class JoinRoomRequest(BaseModel):
    user_id: str
    username: str

class SubmitAnswerRequest(BaseModel):
    user_id: str
    question_index: int
    answer: int
    time_taken: float

class UserQuizStats(BaseModel):
    user_id: str
    total_games: int = 0
    games_won: int = 0
    total_points: int = 0
    correct_answers: int = 0
    total_answers: int = 0
    best_streak: int = 0
    current_streak: int = 0
    categories_played: Dict[str, int] = {}
    last_played: Optional[datetime] = None


def get_categories_with_counts() -> List[Dict]:
    counts = {}
    for q in ALL_QUESTIONS:
        counts[q["cat"]] = counts.get(q["cat"], 0) + 1
    result = []
    for c in QUIZ_CATEGORIES:
        result.append({**c, "question_count": counts.get(c["id"], 0)})
    return result


def get_questions_for_category(category: str, count: int = 10, difficulty: str = None) -> List[Dict]:
    pool = [q for q in ALL_QUESTIONS if q["cat"] == category]
    if difficulty:
        filtered = [q for q in pool if q.get("d") == difficulty]
        if filtered:
            pool = filtered
    random.shuffle(pool)
    selected = pool[:count]
    return [{
        "id": q["id"],
        "category": q["cat"],
        "question": q["q"],
        "options": q["o"],
        "correct_answer": q["a"],
        "explanation": q.get("exp", ""),
        "source": q.get("src", ""),
        "difficulty": q.get("d", "medium"),
        "points": q.get("p", 10)
    } for q in selected]


def get_mixed_questions(count: int = 20) -> List[Dict]:
    pool = list(ALL_QUESTIONS)
    random.shuffle(pool)
    selected = pool[:count]
    return [{
        "id": q["id"],
        "category": q["cat"],
        "question": q["q"],
        "options": q["o"],
        "correct_answer": q["a"],
        "explanation": q.get("exp", ""),
        "source": q.get("src", ""),
        "difficulty": q.get("d", "medium"),
        "points": q.get("p", 10)
    } for q in selected]


# In-memory stores
quiz_rooms: Dict[str, QuizRoom] = {}
solo_sessions: Dict[str, Dict] = {}
user_stats: Dict[str, Dict] = {}
leaderboard_data: List[Dict] = []


def update_leaderboard(user_id: str, username: str, score: int, correct: int, total: int):
    """Update global leaderboard"""
    existing = next((e for e in leaderboard_data if e["user_id"] == user_id), None)
    if existing:
        existing["total_points"] += score
        existing["total_correct"] += correct
        existing["total_questions"] += total
        existing["games_played"] += 1
        if score > existing.get("best_score", 0):
            existing["best_score"] = score
        existing["username"] = username
        existing["updated_at"] = datetime.now(timezone.utc).isoformat()
    else:
        leaderboard_data.append({
            "user_id": user_id,
            "username": username,
            "total_points": score,
            "total_correct": correct,
            "total_questions": total,
            "best_score": score,
            "games_played": 1,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    leaderboard_data.sort(key=lambda x: x["total_points"], reverse=True)


def get_leaderboard(limit: int = 50) -> List[Dict]:
    return [{
        "rank": i + 1,
        "user_id": e["user_id"],
        "username": e["username"],
        "total_points": e["total_points"],
        "games_played": e["games_played"],
        "best_score": e.get("best_score", 0),
        "accuracy": round(e["total_correct"] / max(e["total_questions"], 1) * 100)
    } for i, e in enumerate(leaderboard_data[:limit])]
