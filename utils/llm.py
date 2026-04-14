import os
from langchain_groq import ChatGroq
from langchain_core.language_models import FakeListChatModel
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    api_key = os.environ.get("GROQ_API_KEY")
    if api_key and api_key != "your_api_key_here":
        return ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key)
    
    # Fake model for immediate hackathon mock testing without a key
    print("WARNING: Using FakeListChatModel because GROQ_API_KEY is not set.")
    return FakeListChatModel(responses=["This is a mock response from effiCouncil Agent." * 3])
