from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import uvicorn
import uuid

from database import get_db, init_db
from models import Gist, Comment, User
from auth import hash_password, verify_password, create_access_token, verify_token

app = FastAPI(title="Whisper Intel API")

# Initialize database tables
init_db()

# CORS - Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Whisper Intel API is running with PostgreSQL!"}

@app.get("/api/gists")
def get_gists(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    
    gists = db.query(Gist).all()
    
    # Calculate trending score for each gist
    now = datetime.utcnow()
    for gist in gists:
        # Time decay (newer = higher score)
        age_hours = (now - gist.created_at).total_seconds() / 3600
        time_score = 1 / (age_hours + 2)  # +2 to prevent division by zero
        
        # Comment count
        comment_count = db.query(Comment).filter(Comment.gist_id == gist.id).count()
        
        # Trending score formula
        # Breaking news gets 2x boost
        breaking_multiplier = 2 if gist.is_breaking else 1
        
        trending_score = (
            (gist.votes * 10) +           # Votes are important
            (time_score * 50) +            # Recency matters
            (comment_count * 5) +          # Engagement matters
            (gist.confidence_score * 0.5)  # Confidence adds weight
        ) * breaking_multiplier
        
        gist.trending_score = trending_score
    
    # Sort by trending score
    gists.sort(key=lambda x: x.trending_score, reverse=True)
    
    return [gist.to_dict() for gist in gists]

@app.post("/api/gists")
def create_gist(gist_data: dict, db: Session = Depends(get_db)):
    new_gist = Gist(
        id=str(uuid.uuid4()),
        title=gist_data["title"],
        content=gist_data["content"],
        category=gist_data["category"],
        is_breaking=gist_data.get("is_breaking", False),
        votes=0,
        confidence_score=50,
        created_at=datetime.utcnow()
    )
    db.add(new_gist)
    db.commit()
    db.refresh(new_gist)
    return new_gist.to_dict()

@app.post("/api/gists/{gist_id}/vote")
def vote_gist(gist_id: str, vote_data: dict, db: Session = Depends(get_db)):
    gist = db.query(Gist).filter(Gist.id == gist_id).first()
    if gist:
        gist.votes += vote_data["value"]
        gist.confidence_score = min(95, 50 + (gist.votes * 5))
        db.commit()
        db.refresh(gist)
        return gist.to_dict()
    return {"error": "Gist not found"}

@app.get("/api/gists/{gist_id}/comments")
def get_comments(gist_id: str, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.gist_id == gist_id).order_by(Comment.created_at.desc()).all()
    return [comment.to_dict() for comment in comments]

@app.post("/api/gists/{gist_id}/comments")
def create_comment(gist_id: str, comment_data: dict, db: Session = Depends(get_db)):
    new_comment = Comment(
        id=str(uuid.uuid4()),
        gist_id=gist_id,
        author=comment_data.get("author", "Anonymous"),
        content=comment_data["content"],
        created_at=datetime.utcnow()
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment.to_dict()

@app.post("/api/auth/signup")
def signup(user_data: dict, db: Session = Depends(get_db)):
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data["username"]).first()
    if existing_user:
        return {"error": "Username already taken"}
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_data["email"]).first()
    if existing_email:
        return {"error": "Email already registered"}
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        username=user_data["username"],
        email=user_data["email"],
        password_hash=hash_password(user_data["password"]),
        reputation=0,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    token = create_access_token({"user_id": new_user.id, "username": new_user.username})
    
    return {
        "user": new_user.to_dict(),
        "token": token
    }

@app.post("/api/auth/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(User).filter(User.username == credentials["username"]).first()
    
    if not user or not verify_password(credentials["password"], user.password_hash):
        return {"error": "Invalid username or password"}
    
    # Create access token
    token = create_access_token({"user_id": user.id, "username": user.username})
    
    return {
        "user": user.to_dict(),
        "token": token
    }

@app.get("/api/auth/me")
def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        return {"error": "Invalid token"}
    
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        return {"error": "User not found"}
    
    return user.to_dict()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)