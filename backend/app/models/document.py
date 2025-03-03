from sqlalchemy import Column, Integer, String
from ..database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, unique=True, index=True)
    title = Column(String)
    position = Column(Integer)
    
    class Config:
        orm_mode = True 