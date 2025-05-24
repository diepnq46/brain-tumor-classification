from sqlalchemy import Column, Integer, String, Enum
from models.database import Base
from enum import Enum as PyEnum

class Role(str, PyEnum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(Enum(Role), default=Role.USER)