# in app/db/database.py
import os
from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv

load_dotenv()

# The DATABASE_URL will be provided by the Render environment or .env file
# For local development, we can override it to use SQLite
DATABASE_URL = os.getenv("DATABASE_URL")
IS_LOCAL_DEV = os.getenv("IS_LOCAL_DEV")

# Define the local SQLite database URL
LOCAL_SQLITE_URL = "sqlite:///./database.db"

if IS_LOCAL_DEV == "true":
    # If IS_LOCAL_DEV is explicitly set to true, always use SQLite for local development
    print("IS_LOCAL_DEV is true, using SQLite database for local development.")
    DATABASE_URL = LOCAL_SQLITE_URL
elif not DATABASE_URL:
    # If DATABASE_URL is not set at all, default to SQLite
    print("DATABASE_URL not set, defaulting to SQLite database for local development.")
    DATABASE_URL = LOCAL_SQLITE_URL
else:
    # Otherwise, use the provided DATABASE_URL (e.g., from Render environment or .env)
    print(f"Using database from DATABASE_URL: {DATABASE_URL}")

# The 'connect_args' is recommended for SSL connections on some platforms
# For SQLite, sslmode is not applicable, so we need to handle it conditionally
connect_args = {}
if "postgresql" in DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
