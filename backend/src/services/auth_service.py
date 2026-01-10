from sqlmodel import Session, select
from typing import Optional
from datetime import timedelta
from ..models.user import User, UserCreate
from ..utils.auth import verify_password, get_password_hash, create_access_token
from ..database.database import get_session
from fastapi import Depends, HTTPException, status


class AuthService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def register_user(self, user_create: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        existing_user = self.session.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        
        # Create new user
        db_user = User(
            email=user_create.email,
            name=user_create.name,
            hashed_password=get_password_hash(user_create.password)
        )
        
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user."""
        user = self.session.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for a user."""
        data = {"sub": user.email}
        expires = timedelta(minutes=10080)  # 7 days
        return create_access_token(data=data, expires_delta=expires)