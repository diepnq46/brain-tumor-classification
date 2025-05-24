import os
import uuid

from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from typing import List
from sqlalchemy.orm import Session
from models.user import User, Role
from models.prediction import Prediction, Gender
from schemas.prediction import PredictionOut, PredictionUpdate
from dependencies.db import get_db
from dependencies.auth import get_current_user
from utils.image_processing import process_and_predict

router = APIRouter()
# Đảm bảo thư mục uploads tồn tại
UPLOAD_DIR = Path("D:/University/doantotnghiep/brain_tumor_api/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/predict", response_model=PredictionOut)
async def predict(
        patient_name: str = Form(...),
        age: int = Form(...),
        gender: Gender = Form(...),
        image: UploadFile = File(...),
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Kiểm tra định dạng file
    if not image.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Only PNG, JPG, or JPEG files are allowed")

    # Tạo tên file duy nhất để tránh trùng lặp
    file_extension = os.path.splitext(image.filename)[1]  # Lấy đuôi file (.jpg, .png, v.v.)
    unique_filename = f"{uuid.uuid4()}{file_extension}"  # Tạo tên file duy nhất bằng UUID
    image_path = UPLOAD_DIR / unique_filename  # Đường dẫn đầy đủ: uploads/<uuid>.jpg

    # Lưu file
    try:
        with open(image_path, "wb") as f:
            content = await image.read()  # Đọc file
            f.write(content)  # Ghi file
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

    # Đặt lại con trỏ file (nếu cần dùng lại image)
    # Vì process_and_predict cần file, ta sẽ truyền đường dẫn thay vì đọc lại
    image.file.seek(0)

    # Process image and predict
    try:
        result = process_and_predict(image)
    except Exception as e:
        # Xóa file nếu có lỗi
        if image_path.exists():
            image_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

    # Save prediction to database
    try:
        db_prediction = Prediction(
            patient_name=patient_name,
            age=age,
            gender=gender,
            image_path=str(unique_filename),  # Lưu đường dẫn dưới dạng string
            prediction_result=result,
            user_id=current_user.id
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
    except Exception as e:
        # Xóa file nếu có lỗi khi lưu vào database
        if image_path.exists():
            image_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error saving prediction to database: {str(e)}")

    return db_prediction


@router.get("/{prediction_id}", response_model=PredictionOut)
async def get_prediction_detail(
        prediction_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    if current_user.role != Role.ADMIN and db_prediction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this prediction")

    return db_prediction

@router.get("/", response_model=List[PredictionOut])
async def get_predictions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == Role.ADMIN:
        predictions = db.query(Prediction).all()
    else:
        predictions = db.query(Prediction).filter(Prediction.user_id == current_user.id).all()
    return predictions


@router.put("/{prediction_id}", response_model=PredictionOut)
async def update_prediction(
        prediction_id: int,
        prediction_update: PredictionUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    if current_user.role != Role.ADMIN and db_prediction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this prediction")

    if prediction_update.patient_name:
        db_prediction.patient_name = prediction_update.patient_name
    if prediction_update.age:
        db_prediction.age = prediction_update.age
    if prediction_update.gender:
        db_prediction.gender = prediction_update.gender
    if prediction_update.prediction_result and current_user.role == Role.ADMIN:
        db_prediction.prediction_result = prediction_update.prediction_result

    db.commit()
    db.refresh(db_prediction)
    return db_prediction


@router.delete("/{prediction_id}")
async def delete_prediction(
        prediction_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Tìm bản ghi
    db_prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    # Kiểm tra quyền
    if current_user.role != Role.ADMIN and db_prediction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this prediction")

    # Xóa file ảnh nếu tồn tại
    image_path = Path(db_prediction.image_path)
    if image_path.exists():
        try:
            image_path.unlink()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting image file: {str(e)}")

    # Xóa bản ghi trong database
    try:
        db.delete(db_prediction)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting prediction from database: {str(e)}")

    return {"message": "Prediction deleted successfully"}