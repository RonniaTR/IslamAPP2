class UserMessage:
    def __init__(self, text=""):
        self.text = text

class LlmChat:
    def __init__(self, **kwargs):
        self.kwargs = kwargs

    async def send_message(self, message):
        return "AI servisi şu anda kullanılamıyor (mock mod)."
