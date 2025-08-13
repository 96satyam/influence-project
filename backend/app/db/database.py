# in app/db/database.py
import os
from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv

load_dotenv()

# The DATABASE_URL will be provided by the Render environment
DATABASE_URL = os.getenv("DATABASE_URL")

# The 'connect_args' is recommended for SSL connections on some platforms
engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"}, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)