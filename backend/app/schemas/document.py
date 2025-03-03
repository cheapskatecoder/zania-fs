from pydantic import BaseModel
from typing import List

class DocumentBase(BaseModel):
    type: str
    title: str
    position: int

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    
    class Config:
        orm_mode = True
        from_attributes = True

class DocumentList(BaseModel):
    documents: List[Document] 