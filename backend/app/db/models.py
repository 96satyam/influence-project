# app/db/models.py
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class User(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    profile_picture_url: Optional[str] = None
    access_token: str
    
    # This relationship links this User to many Posts
    posts: List["Post"] = Relationship(back_populates="user")


class Post(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    content: str
    status: str = "draft"
    scheduled_at: Optional[str] = None

    mock_likes: int = Field(default=0)
    mock_comments: int = Field(default=0)
    mock_shares: int = Field(default=0)

    user_id: str = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="posts")

    
    # This relationship links this Post back to one User
    user: User = Relationship(back_populates="posts")


# This manually updates the model references, resolving the relationship error.
User.model_rebuild()
Post.model_rebuild()