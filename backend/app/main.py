from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from .database import engine, get_db, Base
from .routers import documents
from .models.document import Document as DocumentModel

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Drag and Drop API")

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(documents.router)

# Seed data if documents table is empty
@app.on_event("startup")
async def seed_data():
    db = next(get_db())
    if db.query(DocumentModel).count() == 0:
        # Initial document data
        initial_documents = [
            {"type": "bank-draft", "title": "Bank Draft", "position": 0},
            {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1},
            {"type": "invoice", "title": "Invoice", "position": 2},
            {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3},
            {"type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4}
        ]
        
        for doc_data in initial_documents:
            db_document = DocumentModel(**doc_data)
            db.add(db_document)
        
        db.commit()

@app.get("/")
def read_root():
    return {"message": "Welcome to Drag and Drop API"}
