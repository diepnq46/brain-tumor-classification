import numpy as np
from fastapi import UploadFile
from tensorflow.keras.models import load_model
from PIL import Image
import io
from models.prediction import TumorType

MODEL_PATH = "D:/University/doantotnghiep/braintumor_model.keras"  # Cập nhật đường dẫn
model = load_model(MODEL_PATH)

def preprocess_image(image: UploadFile):
    content = image.file.read()
    img = Image.open(io.BytesIO(content))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224), Image.Resampling.LANCZOS)
    img_array = np.array(img)
    if img_array.shape != (224, 224, 3):
        raise ValueError(f"Image shape {img_array.shape} does not match expected (224, 224, 3)")
    img_array = img_array / 255.0
    img_array = img_array.reshape(1, 224, 224, 3)
    return img_array

def map_model_output_to_tumor_type(prediction):
    tumor_types = [TumorType.GLIOMA, TumorType.MENINGIOMA, TumorType.NO_TUMOR, TumorType.PITUITARY]
    predicted_class = np.argmax(prediction, axis=1)[0]
    return tumor_types[predicted_class]

def process_and_predict(image: UploadFile):
    img_array = preprocess_image(image)
    prediction = model.predict(img_array)
    return map_model_output_to_tumor_type(prediction)