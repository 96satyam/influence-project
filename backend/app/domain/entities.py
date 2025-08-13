# app/domain/entities.py
from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class UserProfile(BaseModel):
    id: str
    first_name: str
    last_name: str
    headline: str
    profile_picture_url: Optional[HttpUrl] = None
    summary: Optional[str] = None
    skills: List[str] = []