import os
import together
from dotenv import load_dotenv

def setup_llm_creds():
    """Setup Together AI credentials from environment variables"""
    load_dotenv()
    together.api_key = os.getenv("TOGETHER_API_KEY")

def get_llm():
    """Get Together AI client"""
    return together 