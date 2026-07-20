from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
import logging

logger = logging.getLogger(__name__)

# ===================== BASE CONTENT MODEL =====================
class BaseContentModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    description: Optional[str] = None
    coverImage: Optional[str] = None
    thumbnail: Optional[str] = None
    
    difficulty: Optional[str] = "beginner" # beginner, intermediate, advanced
    estimatedReadingTime: Optional[int] = 0 # in minutes
    estimatedListeningTime: Optional[int] = 0 # in minutes
    
    tags: List[str] = []
    relatedContent: List[str] = [] # list of IDs
    language: str = "tr"
    
    status: str = "draft" # draft, published, archived
    publishedAt: Optional[datetime] = None
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    order: int = 0
    isPremium: bool = False
    isFeatured: bool = False
    isRecommended: bool = False

# ===================== SPECIFIC CONTENT MODELS =====================
class Category(BaseContentModel):
    icon: Optional[str] = None # For category specific icons

class Theme(BaseContentModel):
    # e.g., "Patience", "Gratitude"
    pass

class Series(BaseContentModel):
    # e.g., "Ramazan Günlükleri"
    progress: Optional[int] = 0 # For client side tracking

class Lesson(BaseContentModel):
    seriesId: Optional[str] = None
    content: str = "" # Rich text or markdown
    videoUrl: Optional[str] = None
    audioUrl: Optional[str] = None

class Article(BaseContentModel):
    content: str = "" # Rich text or markdown
    author: Optional[str] = None

class AudioContent(BaseContentModel):
    audioUrl: str
    durationSeconds: int = 0
    narrator: Optional[str] = None

class Collection(BaseContentModel):
    """Used for dynamic lists like 'Recommended For You', 'Trending'"""
    items: List[str] = [] # List of content IDs or structured objects
    type: str = "mixed" # series, audio, article, mixed

class ContentActivity(BaseModel):
    contentId: str
    type: str
    action: str = "view" # view, listen, complete
    userId: Optional[str] = "anonymous" # Should be taken from auth token in real app

# ===================== CMS CREATE/UPDATE MODELS =====================
# For CMS endpoints, making many fields optional
class ContentCreate(BaseModel):
    slug: str
    title: str
    description: Optional[str] = None
    coverImage: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty: Optional[str] = "beginner"
    tags: List[str] = []
    status: str = "draft"
    isPremium: bool = False
    isFeatured: bool = False
    isRecommended: bool = False
    order: int = 0
    # Additional specific fields
    icon: Optional[str] = None
    content: Optional[str] = None
    videoUrl: Optional[str] = None
    audioUrl: Optional[str] = None
    seriesId: Optional[str] = None
    durationSeconds: Optional[int] = 0
    narrator: Optional[str] = None
    items: Optional[List[str]] = []

# ===================== ROUTER =====================
dynamic_content_router = APIRouter(prefix="/content", tags=["Dynamic Content"])
admin_content_router = APIRouter(prefix="/admin/content", tags=["Admin CMS"])

def setup_dynamic_content_routes(app, db):
    
    # ------------------ ADMIN CMS ENDPOINTS ------------------
    @admin_content_router.post("/{content_type}")
    async def create_content(content_type: str, item: ContentCreate, request: Request):
        """CMS endpoint to create any type of content without code changes"""
        # content_type can be: category, theme, series, lesson, article, audio, collection
        valid_types = ["category", "theme", "series", "lesson", "article", "audio", "collection"]
        if content_type not in valid_types:
            raise HTTPException(status_code=400, detail="Invalid content type")
            
        now = datetime.now(timezone.utc)
        
        base_data = {
            "id": str(uuid.uuid4()),
            "slug": item.slug,
            "title": item.title,
            "description": item.description,
            "coverImage": item.coverImage,
            "thumbnail": item.thumbnail,
            "difficulty": item.difficulty,
            "tags": item.tags,
            "status": item.status,
            "publishedAt": now if item.status == "published" else None,
            "updatedAt": now,
            "createdAt": now,
            "isPremium": item.isPremium,
            "isFeatured": item.isFeatured,
            "isRecommended": item.isRecommended,
            "order": item.order,
            "type": content_type
        }
        
        # Add specific fields based on type
        if content_type == "category":
            base_data["icon"] = item.icon
        elif content_type in ["lesson", "article"]:
            base_data["content"] = item.content
            base_data["seriesId"] = item.seriesId
            base_data["videoUrl"] = item.videoUrl
            base_data["audioUrl"] = item.audioUrl
        elif content_type == "audio":
            base_data["audioUrl"] = item.audioUrl
            base_data["durationSeconds"] = item.durationSeconds
            base_data["narrator"] = item.narrator
        elif content_type == "collection":
            base_data["items"] = item.items

        collection_name = f"cms_{content_type}s"
        await db[collection_name].insert_one(base_data)
        
        return {"success": True, "message": f"{content_type.capitalize()} created successfully", "data": base_data}

    @admin_content_router.get("/{content_type}")
    async def list_admin_content(content_type: str):
        valid_types = ["category", "theme", "series", "lesson", "article", "audio", "collection"]
        if content_type not in valid_types:
            raise HTTPException(status_code=400, detail="Invalid content type")
            
        collection_name = f"cms_{content_type}s"
        cursor = db[collection_name].find().sort("createdAt", -1)
        items = await cursor.to_list(length=100)
        
        # remove _id for json serialization
        for item in items:
            item["_id"] = str(item["_id"])
            
        return {"success": True, "data": items}

    # ------------------ CLIENT ENDPOINTS ------------------
    @dynamic_content_router.get("/discover")
    async def get_discover_feed(request: Request):
        """
        Loads the completely dynamic 'Discover' / 'Keşfet' screen.
        Everything returned here dictates what the React frontend renders.
        """
        # Fetch published collections meant for discover page
        # In a real app, this would be highly personalized via AI recommendation engine
        # For now, we pull from CMS
        
        try:
            # 1. Categories
            categories = await db["cms_categorys"].find({"status": "published"}).sort("order", 1).to_list(length=20)
            
            # 2. Featured / Recommended (AI Based)
            # Fetch user activity to influence recommendations
            # Since we don't have real auth hooked up to this endpoint yet, we simulate
            user_id = "anonymous"
            recent_activities = await db["cms_activities"].find({"userId": user_id}).sort("timestamp", -1).limit(10).to_list(length=10)
            
            recommended = []
            if recent_activities:
                # Basic Recommendation Logic: find content with similar tags to recently viewed
                viewed_ids = [act["contentId"] for act in recent_activities]
                viewed_content = await db["cms_articles"].find({"id": {"$in": viewed_ids}}).to_list(length=10)
                
                favorite_tags = set()
                for c in viewed_content:
                    if "tags" in c:
                        favorite_tags.update(c["tags"])
                
                if favorite_tags:
                    recommended = await db["cms_articles"].find({
                        "status": "published", 
                        "tags": {"$in": list(favorite_tags)},
                        "id": {"$nin": viewed_ids} # exclude already viewed
                    }).limit(5).to_list(length=5)
            
            # Fallback to featured if no recommendations
            if len(recommended) < 3:
                featured = await db["cms_articles"].find({"status": "published", "isFeatured": True}).limit(5).to_list(length=5)
                recommended.extend(featured)
                
            # Remove duplicates by id
            recommended_unique = {r["id"]: r for r in recommended}.values()
            recommended = list(recommended_unique)[:5]
            
            # 3. Series
            series = await db["cms_seriess"].find({"status": "published"}).sort("order", 1).to_list(length=5)
            
            # 4. Audio
            audio = await db["cms_audios"].find({"status": "published"}).sort("createdAt", -1).to_list(length=5)

            # Format response (strip _id)
            for c in categories: c["_id"] = str(c["_id"])
            for f in recommended: f["_id"] = str(f["_id"])
            for s in series: s["_id"] = str(s["_id"])
            for a in audio: a["_id"] = str(a["_id"])

            return {
                "success": True,
                "data": {
                    "sections": [
                        {
                            "id": "continue_reading",
                            "type": "continue",
                            "title": "Devam Et",
                            "items": [] # Will be populated by user activity
                        },
                        {
                            "id": "recommended",
                            "type": "cards",
                            "title": "Sana Özel",
                            "items": recommended
                        },
                        {
                            "id": "quick_categories",
                            "type": "grid",
                            "title": "Hızlı Kategoriler",
                            "items": categories
                        },
                        {
                            "id": "active_series",
                            "type": "cards_progress",
                            "title": "Seriler",
                            "items": series
                        },
                        {
                            "id": "audio_content",
                            "type": "audio_cards",
                            "title": "Sesli İçerikler",
                            "items": audio
                        }
                    ]
                }
            }
        except Exception as e:
            logger.error(f"Error loading discover feed: {e}")
            raise HTTPException(status_code=500, detail="Could not load discover feed")

    @dynamic_content_router.get("/{content_type}/{slug}")
    async def get_content_detail(content_type: str, slug: str):
        valid_types = ["category", "theme", "series", "lesson", "article", "audio"]
        if content_type not in valid_types:
            raise HTTPException(status_code=400, detail="Invalid content type")
            
        collection_name = f"cms_{content_type}s"
        item = await db[collection_name].find_one({"slug": slug, "status": "published"})
        
        if not item:
            raise HTTPException(status_code=404, detail="Content not found")
            
        item["_id"] = str(item["_id"])
        
        # If it's a series, fetch its lessons
        lessons = []
        if content_type == "series":
            cursor = db["cms_lessons"].find({"seriesId": item["id"], "status": "published"}).sort("order", 1)
            lessons = await cursor.to_list(length=100)
            for l in lessons: l["_id"] = str(l["_id"])
            item["lessons"] = lessons
            
        return {"success": True, "data": item}

    @dynamic_content_router.post("/activity")
    async def log_content_activity(activity: ContentActivity):
        """Logs user interactions (views, listens) for AI recommendations and history"""
        act_dict = activity.model_dump()
        act_dict["timestamp"] = datetime.now(timezone.utc)
        await db["cms_activities"].insert_one(act_dict)
        return {"success": True}

    app.include_router(admin_content_router)
    app.include_router(dynamic_content_router)
    
    logger.info("Dynamic CMS Content routes successfully registered.")
