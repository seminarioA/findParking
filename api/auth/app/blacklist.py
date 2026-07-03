from app.models import TokenBlacklist
from sqlalchemy.orm import Session


def revoke_token(jti: str, db: Session):
    db_token = TokenBlacklist(jti=jti)
    db.add(db_token)
    db.commit()
