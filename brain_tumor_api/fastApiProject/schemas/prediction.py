from pydantic import BaseModel
from models.prediction import Gender, TumorType
from datetime import datetime

class PredictionCreate(BaseModel):
    patient_name: str
    age: int
    gender: Gender

class  PredictionUpdate(BaseModel):
    patient_name: str | None = None
    age: int | None = None
    gender: Gender | None = None
    prediction_result: TumorType | None = None

class PredictionOut(BaseModel):
    id: int
    patient_name: str
    age: int
    gender: Gender
    image_path: str
    prediction_result: TumorType
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True