import os
import logging
from groq import Groq
from typing import List, Dict

logger = logging.getLogger(__name__)

class ChatAgent:
    _client = None
    _api_key = os.getenv("GROQ_API_KEY")


    @classmethod
    def get_client(cls):
        if cls._client is None:
            try:
                cls._client = Groq(api_key=cls._api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
        return cls._client

    @staticmethod
    def chat(messages: List[Dict], context_data: dict = None) -> str:
        """
        Sends message to Groq Llama 3 with context about the current workforce.
        """
        client = ChatAgent.get_client()
        if not client:
            return "AI Service Unavailable."

        # Construct System Prompt with Context
        system_prompt = (
            "You are an expert HR Analytics Assistant named 'RetentionAI'. "
            "Your goal is to help HR managers make data-driven retention decisions.\n"
            "Keep answers professional, concise, and business-focused.\n"
        )
        
        if context_data:
            system_prompt += f"\nCURRENT DATA CONTEXT:\n"
            system_prompt += f"- Total Employees: {context_data.get('total_employees', 0)}\n"
            system_prompt += f"- High Risk: {context_data.get('risk_breakdown', {}).get('High', 0)}\n"
            system_prompt += f"- Critical Talent at Risk: {context_data.get('critical_talent', 0)}\n"
            if context_data.get('insights'):
                system_prompt += f"- Key Insights: {'; '.join(context_data['insights'])}\n"

        # Prepare messages
        full_messages = [
            {"role": "system", "content": system_prompt}
        ] + messages

        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=full_messages,
                temperature=0.7,
                max_tokens=500
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq Chat Error: {e}", exc_info=True)
            print(f"!!! GROQ ERROR: {str(e)} !!!") # Print to stdout for visibility
            return f"I apologize, but I'm having trouble connecting to the AI service right now. Error: {str(e)}"
