COMPARATIVE_TEXTS = {
    "faith": {
        "topic": "faith",
        "title": "İman ve İbadet",
        "summary": "İslam, Hristiyanlık ve Yahudilikte iman ve ibadetin temel ilkeleri.",
        "points": [
            "İslam'da iman, kalp, dil ve bedenle yaşanır.",
            "Hristiyanlıkta iman, Mesih'e güven ve hayatın dönüştürülmesiyle ilişkilidir.",
            "Yahudilikte iman, Allah'a bağlılık ve Tevrat'a uymayı içerir."
        ],
    },
    "ethics": {
        "topic": "ethics",
        "title": "Ahlak ve Adalet",
        "summary": "Farklı inanç geleneklerinde ahlak ve adalet anlayışı.",
        "points": [
            "İslam'da adalet, bireysel ve toplumsal hayatın temelidir.",
            "Hristiyanlıkta merhamet ve sevgi adaletle birlikte yürür.",
            "Yahudilikte adalet, toplumun ve bireyin ahlaki düzenini korur."
        ],
    },
}

TOPICS = {
    topic_id: {
        "id": topic_id,
        "title": data["title"],
        "summary": data["summary"],
        "topic": data["topic"],
    }
    for topic_id, data in COMPARATIVE_TEXTS.items()
}


def get_comparative_data(topic_id: str = "faith"):
    if not topic_id:
        return {}
    data = COMPARATIVE_TEXTS.get(topic_id)
    if not data:
        return {}
    return {"topic": topic_id, **data}


def get_all_topics():
    return list(TOPICS.values())


def search_comparative(q: str):
    query = (q or "").strip().lower()
    if not query:
        return []
    return [
        topic
        for topic in get_all_topics()
        if query in topic.get("title", "").lower() or query in topic.get("summary", "").lower()
    ]
