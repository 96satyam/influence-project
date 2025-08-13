# app/adapters/llm_service.py
import os
from openai import AsyncOpenAI
from backend.app.core.ports import ContentGenerationPort
from backend.app.db.models import User
# ⭐️ 1. Import the new search adapter
from backend.app.adapters.search_service import TavilySearchAdapter

class PerplexityAdapter(ContentGenerationPort):
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("PERPLEXITY_API_KEY"),
            base_url="https://api.perplexity.ai"
        )
        # ⭐️ 2. Instantiate the search adapter
        self.search_adapter = TavilySearchAdapter()

    # ⭐️ 3. Update the method to accept an 'industry'
    async def generate_post(self, user: User, industry: str) -> str:
        """
        Generates a post by first researching trends and then creating content.
        """
        # ⭐️ 4. Perform the search first
        trends_summary = self.search_adapter.search_trends(industry)

        system_prompt = (
            "You are an expert LinkedIn content strategist. Your task is to write an insightful, "
            "engaging post based on a user's profile and recent industry trends provided to you. "
            "Your output must be ONLY the text of the LinkedIn post and nothing else."
        )

        # ⭐️ 5. Inject the trend data into the prompt
        user_prompt = (
            f"USER PROFILE DATA:\n"
            f"Name: {user.first_name} {user.last_name}\n\n"
            f"RECENT INDUSTRY TRENDS for '{industry}':\n{trends_summary}\n\n"
            f"POST INSTRUCTIONS:\n"
            f"Write a short, insightful post in the first person that connects the user's perspective "
            f"with one or more of the recent trends. End with an engaging question for the audience.\n\n"
            f"LINKEDIN POST TEXT:"
        )

        response = await self.client.chat.completions.create(
            # ... (rest of the API call is the same)
            model="sonar",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=768
        )

        generated_post = response.choices[0].message.content
        return generated_post.strip()
