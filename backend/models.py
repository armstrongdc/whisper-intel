from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Gist(Base):
    __tablename__ = "gists"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    is_breaking = Column(Boolean, default=False)
    votes = Column(Integer, default=0)
    confidence_score = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "category": self.category,
            "is_breaking": self.is_breaking,
            "votes": self.votes,
            "confidence_score": self.confidence_score,
            "created_at": self.created_at.isoformat()
        }


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, index=True)
    gist_id = Column(String, nullable=False)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "gist_id": self.gist_id,
            "author": self.author,
            "content": self.content,
            "created_at": self.created_at.isoformat()
        }

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    reputation = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "reputation": self.reputation,
            "created_at": self.created_at.isoformat()
        }