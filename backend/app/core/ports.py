# app/core/ports.py
from abc import ABC, abstractmethod
from backend.app.domain.entities import UserProfile
from backend.app.db.models import User


class UserProfilePort(ABC):
    """A port for fetching a user's professional profile."""

    @abstractmethod
    def get_profile(self, access_token: str) -> UserProfile:
        """Fetches the user profile using a provided access token."""
        pass

class ContentGenerationPort(ABC):
    """A port for generating content using an AI model."""

    @abstractmethod
    async def generate_post(self, user: User) -> str:
        """Generates a LinkedIn post based on the user's profile."""
        pass
