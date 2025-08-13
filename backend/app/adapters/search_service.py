# app/adapters/search_service.py
import os
from tavily import TavilyClient

class TavilySearchAdapter:
    def __init__(self):
        self.client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

    def search_trends(self, industry: str) -> str:
        """
        Performs a search for recent trends in a given industry and returns a summary.
        """
        query = f"latest news and key trends in the {industry} industry in 2025"
        try:
            # include_raw_content can be useful for more detailed prompts later
            response = self.client.search(
                query=query, 
                search_depth="basic", 
                max_results=3
            )

            # We'll format the results into a clean summary string
            summary = "Recent Industry Trends:\n"
            for result in response.get('results', []):
                summary += f"- {result.get('title')}: {result.get('content')}\n"

            return summary
        except Exception as e:
            print(f"Error during Tavily search: {e}")
            return "No trend data available."