from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.document import Document as DocumentModel
from ..schemas.document import Document, DocumentCreate

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/", response_model=List[Document])
def get_documents(db: Session = Depends(get_db)):
    """Get all documents ordered by position"""
    return db.query(DocumentModel).order_by(DocumentModel.position).all()

@router.post("/", response_model=Document, status_code=status.HTTP_201_CREATED)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    """Create a new document"""
    db_document = DocumentModel(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.put("/batch", response_model=List[Document])
def update_document_positions(documents: List[DocumentCreate], db: Session = Depends(get_db)):
    """Update multiple documents (used for reordering)"""
    document_types = [doc.type for doc in documents]
    
    # Get all documents that need to be updated
    db_documents = db.query(DocumentModel).filter(DocumentModel.type.in_(document_types)).all()
    type_to_document = {doc.type: doc for doc in db_documents}
    
    # Update positions
    for doc in documents:
        if doc.type in type_to_document:
            db_document = type_to_document[doc.type]
            for key, value in doc.dict().items():
                setattr(db_document, key, value)
    
    db.commit()
    
    # Return updated documents
    return db.query(DocumentModel).order_by(DocumentModel.position).all()

@router.put("/{document_id}", response_model=Document)
def update_document(document_id: int, document: DocumentCreate, db: Session = Depends(get_db)):
    """Update a document by ID"""
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    for key, value in document.dict().items():
        setattr(db_document, key, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a document by ID"""
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(db_document)
    db.commit()
    return None 