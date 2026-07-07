"""
League System — Lig seviyeleri, sezon yönetimi ve haftalık sıralama.

server.py tarafından import edilen 3 fonksiyonu sağlar:
  • build_league_overview(user_id, user_stats, quiz_stats)
  • build_season_summary(user_stats, quiz_stats)
  • build_weekly_standings(entries)
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

# ─── Lig Seviyeleri ───
LEAGUE_TIERS = [
    {"id": "bronze",   "name": "Bronz",   "name_ar": "برونز",  "icon": "🥉", "min_xp": 0,     "color": "#CD7F32"},
    {"id": "silver",   "name": "Gümüş",   "name_ar": "فضة",   "icon": "🥈", "min_xp": 500,   "color": "#C0C0C0"},
    {"id": "gold",     "name": "Altın",    "name_ar": "ذهب",   "icon": "🥇", "min_xp": 1500,  "color": "#FFD700"},
    {"id": "diamond",  "name": "Elmas",    "name_ar": "ألماس", "icon": "💎", "min_xp": 4000,  "color": "#B9F2FF"},
    {"id": "legend",   "name": "Efsane",   "name_ar": "أسطورة","icon": "👑", "min_xp": 10000, "color": "#FF6B6B"},
]


def _get_tier(xp: int) -> Dict:
    """Determine the league tier for a given XP total."""
    current = LEAGUE_TIERS[0]
    for tier in LEAGUE_TIERS:
        if xp >= tier["min_xp"]:
            current = tier
        else:
            break
    return current


def _next_tier(xp: int) -> Optional[Dict]:
    """Return the next tier above the user's current one, or None if at max."""
    for tier in LEAGUE_TIERS:
        if xp < tier["min_xp"]:
            return tier
    return None


def _get_season_info() -> Dict:
    """Calculate the current season window (weekly, Monday–Sunday)."""
    now = datetime.utcnow()
    # Start of current week (Monday)
    start = now - timedelta(days=now.weekday())
    start = start.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=7)
    elapsed = (now - start).total_seconds()
    total = 7 * 24 * 3600
    return {
        "season_name": f"Hafta {now.isocalendar()[1]}",
        "start": start.isoformat(),
        "end": end.isoformat(),
        "days_left": max(0, (end - now).days),
        "progress": round(min(1.0, elapsed / total), 3),
    }


# ─── Public API ──────────────────────────────────────────────

def build_league_overview(*, user_id: str, user_stats: Dict[str, Any], quiz_stats: Dict[str, Any]) -> Dict:
    """Compact overview consumed by the frontend league widget / page.

    Returns tier info, XP breakdown, season progress and rank preview.
    """
    total_xp = int(user_stats.get("total_points", 0))
    weekly_xp = int(user_stats.get("weekly_xp", 0))
    streak = int(user_stats.get("current_streak", 0))
    longest_streak = int(user_stats.get("longest_streak", 0))

    tier = _get_tier(total_xp)
    nxt = _next_tier(total_xp)
    season = _get_season_info()

    # Progress toward next tier (0‑1)
    if nxt:
        tier_progress = (total_xp - tier["min_xp"]) / max(1, nxt["min_xp"] - tier["min_xp"])
        tier_progress = round(min(1.0, max(0, tier_progress)), 3)
        xp_to_next = nxt["min_xp"] - total_xp
    else:
        tier_progress = 1.0
        xp_to_next = 0

    # Quiz accuracy from quiz_stats (pre-computed in server.py)
    accuracy = quiz_stats.get("accuracy", 0)
    quizzes_played = int(quiz_stats.get("total_quizzes", quiz_stats.get("games_played", 0)))

    return {
        "user_id": user_id,
        "tier": tier,
        "next_tier": nxt,
        "tier_progress": tier_progress,
        "xp_to_next": max(0, xp_to_next),
        "total_xp": total_xp,
        "weekly_xp": weekly_xp,
        "streak": streak,
        "longest_streak": longest_streak,
        "accuracy": accuracy,
        "quizzes_played": quizzes_played,
        "season": season,
    }


def build_season_summary(*, user_stats: Dict[str, Any], quiz_stats: Dict[str, Any]) -> Dict:
    """Extended season data for the dedicated league detail view."""
    total_xp = int(user_stats.get("total_points", 0))
    weekly_xp = int(user_stats.get("weekly_xp", 0))
    streak = int(user_stats.get("current_streak", 0))

    tier = _get_tier(total_xp)
    nxt = _next_tier(total_xp)
    season = _get_season_info()

    milestones = []
    for t in LEAGUE_TIERS:
        milestones.append({
            "tier": t["id"],
            "name": t["name"],
            "icon": t["icon"],
            "xp_required": t["min_xp"],
            "reached": total_xp >= t["min_xp"],
        })

    return {
        "tier": tier,
        "next_tier": nxt,
        "total_xp": total_xp,
        "weekly_xp": weekly_xp,
        "streak": streak,
        "season": season,
        "milestones": milestones,
        "accuracy": quiz_stats.get("accuracy", 0),
        "quizzes_played": int(quiz_stats.get("total_quizzes", quiz_stats.get("games_played", 0))),
    }


def build_weekly_standings(entries: List[Dict]) -> Dict:
    """Format a pre-sorted list of user entries into a standings response."""
    season = _get_season_info()
    standings = []
    for i, e in enumerate(entries):
        xp = int(e.get("xp", 0))
        tier = _get_tier(xp)
        standings.append({
            "rank": i + 1,
            "user_id": e.get("user_id", ""),
            "username": e.get("username", "Anonim"),
            "xp": xp,
            "streak": int(e.get("streak", 0)),
            "accuracy": e.get("accuracy", 0),
            "tier": tier,
        })

    return {
        "season": season,
        "standings": standings,
    }
