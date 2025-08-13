# in app/db/database.py
import os
from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv


DATABASE_URL = os.getenv("DATABASE_URL")
# Define the local SQLite database URL
LOCAL_SQLITE_URL = "sqlite:///./database.db"

# If DATABASE_URL is not set, default to SQLite for local development
if not DATABASE_URL:
    print("DATABASE_URL not set, defaulting to SQLite database for local development.")
    DATABASE_URL = LOCAL_SQLITE_URL
else:
    # Otherwise, use the provided DATABASE_URL (e.g., from Render environment or .env)
    print(f"Using database from DATABASE_URL: {DATABASE_URL}")


connect_args = {}
if "postgresql" in DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
