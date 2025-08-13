# app/api/main.py
import os
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from dotenv import load_dotenv

# Load environment variables from the .env file in the backend directory
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'))

from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
import random

from sqlalchemy.orm import selectinload
# Import our new database components and the User model
from backend.app.db.database import engine, create_db_and_tables
from backend.app.db.models import User, Post

# Import the adapter, but we will soon refactor this
from backend.app.adapters.linkedin_api import LinkedInAPIAdapter
from backend.app.domain.entities import UserProfile
from backend.app.adapters.llm_service import PerplexityAdapter


# This is a new function that will run once when the app starts
def on_startup():
    print("Application is starting up...")
    create_db_and_tables()
    print("Database tables created.")

app = FastAPI(
    title="Influence OS AI Agent",
    version="0.1.0",
    on_startup=[on_startup] # Register the startup event handler
)

# This allows our frontend (running on localhost:3000) to make requests to our backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,https://influence-ten.vercel.app").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_at: Optional[str] = None

# --- LinkedIn OAuth Configuration ---
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8000/api/v1/auth/linkedin/callback")
LINKEDIN_SCOPE = "profile openid email"

linkedin_adapter = LinkedInAPIAdapter()
# 2. Instantiate our new adapter
perplexity_adapter = PerplexityAdapter()


@app.get("/health", status_code=200, tags=["Status"])
def health_check():
    return {"status": "ok"}

@app.post("/api/v1/create_test_user", response_model=User, tags=["Development"])
def create_test_user():
    """
    Creates a test user for development purposes.
    """
    with Session(engine) as session:
        test_user = User(
            id="test_user",
            first_name="Test",
            last_name="User",
            profile_picture_url="https://via.placeholder.com/150",
            access_token="mock_token"
        )
        session.add(test_user)
        session.commit()
        session.refresh(test_user)
        return test_user

@app.get("/api/v1/auth/linkedin/login", tags=["Authentication"])
def linkedin_login():
    auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code&client_id={LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={LINKEDIN_REDIRECT_URI}&scope={LINKEDIN_SCOPE}"
    )
    return RedirectResponse(url=auth_url)

@app.get("/api/v1/auth/linkedin/callback", tags=["Authentication"])
async def linkedin_callback(request: Request):
    # Step 1: Exchange code for access token
    code = request.query_params.get("code")
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    payload = {
        "grant_type": "authorization_code", "code": code,
        "redirect_uri": LINKEDIN_REDIRECT_URI, "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    }
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=payload)
    
    token_data = token_response.json()
    access_token = token_data.get("access_token")

    # Step 2: Fetch profile using the adapter
    user_profile = await linkedin_adapter.get_profile(access_token=access_token)

    # Step 3: Save user to the database (Create or Update)
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.id == user_profile.id)).first()
        
        profile_pic_str = str(user_profile.profile_picture_url) if user_profile.profile_picture_url else None
        
        if existing_user:
            existing_user.access_token = access_token
            existing_user.first_name = user_profile.first_name
            existing_user.last_name = user_profile.last_name
            existing_user.profile_picture_url = profile_pic_str
            user_to_save = existing_user
            print(f"User {user_profile.id} updated.")
        else:
            user_to_save = User(
                id=user_profile.id,
                first_name=user_profile.first_name,
                last_name=user_profile.last_name,
                profile_picture_url=profile_pic_str,
                access_token=access_token
            )
            print(f"New user {user_profile.id} created.")
        
        session.add(user_to_save)
        session.commit()
        # We don't need to refresh user_to_save here since we are redirecting
    
    # --- THIS IS THE UPDATED PART ---
    # Define the destination URL for our frontend dashboard
    frontend_dashboard_url = os.getenv("FRONTEND_DASHBOARD_URL", "http://localhost:3000/dashboard")
    
    # Instead of returning JSON, redirect the user back to the frontend,
    # passing the user_id as a query parameter.
    return RedirectResponse(
        url=f"{frontend_dashboard_url}?user_id={user_profile.id}"
    )
class PostGenerateRequest(BaseModel):
    industry: str

@app.post("/api/v1/users/{user_id}/generate_post", response_model=Post, tags=["Content"])
async def generate_post_for_user(user_id: str, request: PostGenerateRequest): # Accept the request body
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            return JSONResponse(status_code=404, content={"message": "User not found"})

        # Pass the industry to the adapter
        generated_content = await perplexity_adapter.generate_post(user, industry=request.industry)

        # ... (code to save the new post to the database is the same)
        new_post = Post(content=generated_content, user_id=user.id, status="draft")
        session.add(new_post)
        session.commit()
        session.refresh(new_post)
        return new_post
    

@app.get("/api/v1/users/{user_id}", response_model=User, tags=["Users"])
def get_user_profile(user_id: str):
    """
    Retrieves a user's profile from the database.
    """
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            return JSONResponse(status_code=404, content={"message": "User not found"})
        return user
    
# This new endpoint will fetch all posts for a given user.
@app.patch("/api/v1/posts/{post_id}", response_model=Post, tags=["Content"])
def update_post(post_id: int, post_update: PostUpdate):
    with Session(engine) as session:
        post = session.get(Post, post_id)
        if not post:
            return JSONResponse(status_code=404, content={"message": "Post not found"})
        
        update_data = post_update.model_dump(exclude_unset=True)
        
        ## Check if the post is being scheduled
        if update_data.get("status") == "scheduled":
        ## Generate and add mock analytics data
            post.mock_likes = random.randint(50, 250)
            post.mock_comments = random.randint(10, 50)
            post.mock_shares = random.randint(2, 15)

        for key, value in update_data.items():
            setattr(post, key, value)
        
        session.add(post)
        session.commit()
        session.refresh(post)
        return post
    
@app.get("/api/v1/users/{user_id}/posts", response_model=List[Post], tags=["Content"])
def get_user_posts(user_id: str):
    """
    Retrieves all posts for a specific user from the database.
    """
    with Session(engine) as session:
        # We use the relationship to easily query posts linked to the user
        user = session.get(User, user_id, options=[selectinload(User.posts)])
        if not user:
            return JSONResponse(status_code=404, content={"message": "User not found"})
        return user.posts
