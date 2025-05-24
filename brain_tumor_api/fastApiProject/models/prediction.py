from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from models.database import Base
from enum import Enum as PyEnum

class Gender(str, PyEnum):
    MALE = "male"
    FEMALE = "female"

class TumorType(str, PyEnum):
    GLIOMA = "Glioma"
    MENINGIOMA = "Meningioma"
    PITUITARY = "Pituitary"
    NO_TUMOR = "No Tumor"

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(255))
    age = Column(Integer)
    gender = Column(Enum(Gender))
    image_path = Column(String(512))
    prediction_result = Column(Enum(TumorType))
    created_at = Column(DateTime, default=func.now())
    user_id = Column(Integer)