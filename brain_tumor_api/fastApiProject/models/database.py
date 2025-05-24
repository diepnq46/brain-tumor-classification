import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://springbootuser:springbootuser@localhost:3306/brain_tumor_db"  # Cập nhật thông tin MySQL
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create engine and test connection
try:
    engine = create_engine(DATABASE_URL, echo=False)

except Exception as e:
    logger.error(f"Database connection failed: {str(e)}")
    raise  # Ném lỗi để dừng ứng dụng nếu kết nối thất bại

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
