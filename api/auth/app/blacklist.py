from sqlalchemy.orm import Session
from app.models import TokenBlacklist

def revoke_token(jti: str, db: Session):
    db_token = TokenBlacklist(jti=jti)
    db.add(db_token)
    db.commit()