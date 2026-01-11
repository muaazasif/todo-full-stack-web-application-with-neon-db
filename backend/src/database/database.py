from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Handle different database types
if DATABASE_URL.startswith("postgresql://"):
    # PostgreSQL connection (including Neon)
    # Add SSL parameters for better connection stability
    connect_args = {
        "connect_timeout": 10,
        "pool_pre_ping": True,  # Verify connections before use
    }
    # For PostgreSQL, we don't need special connect_args like SQLite
elif DATABASE_URL.startswith("sqlite:///./"):
    # Convert relative path to absolute path if using SQLite
    db_file = DATABASE_URL.replace("sqlite:///./", "")
    abs_db_path = os.path.abspath(db_file)
    DATABASE_URL = f"sqlite:///{abs_db_path}"
    print(f"Using SQLite database at: {abs_db_path}")
    # Set connect_args only for SQLite
    connect_args = {
        "check_same_thread": False,
        "timeout": 30
    }
else:
    # Default to SQLite settings if not PostgreSQL
    connect_args = {
        "check_same_thread": False,
        "timeout": 30
    }

# Create engine
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
