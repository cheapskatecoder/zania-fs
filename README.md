# Document Manager Application

## Demo Video

<video src="./video.mp4" width="300"></video>

**[▶️ Click here to view the demo video](./video.mp4)**

<details>
  <summary>View demo video instructions</summary>
  
  - The video is located in the root directory of this project as `video.mp4`
  - You can view it by:
    - Cloning the repository and opening the file locally
    - Clicking on the video.mp4 file in GitHub's file browser
    - Using the direct link above (when viewing this README on GitHub)
</details>

A full-stack document management application with FastAPI backend and React frontend.

## Project Overview

This application allows users to view and reorder documents displayed as cards in a grid layout. Each document has a thumbnail image that can be viewed in a larger modal by clicking on the card. The cards can be rearranged using drag and drop, and changes are automatically saved to the backend every 5 seconds.

## Features

- Display documents in a responsive grid layout (3 per row in the first row, 2 in the second row)
- Assign unique thumbnail images to each document type
- Show loading spinners for images while they load
- Drag-and-drop reordering of document cards using a dedicated drag handle
- View larger image overlay when clicking on a card (close with ESC key)
- Auto-save changes to the backend every 5 seconds
- Show saving status indicator with time since last save
- Optimal spacing between cards to prevent overlapping
- Enhanced accessibility with keyboard navigation
- Advanced data fetching with TanStack Query for caching and background updates

## Tech Stack

### Frontend
- React with TypeScript
- Styled-components for styling
- DND Kit for drag-and-drop functionality
- TanStack Query for server state management
- React hooks for state management

### Backend
- FastAPI (Python 3.10+)
- SQLAlchemy ORM
- Pydantic for data validation
- Alembic for database migrations

### Database
- PostgreSQL (with SQLite fallback for development)

### Deployment
- Docker and docker-compose for containerization
- Nginx for production serving (optional)

## UX/UI Improvements

The application features several UX enhancements:

1. **Dedicated Drag Handle**: Cards include a visible drag handle to clearly indicate drag functionality to users, keeping it separate from click actions.

2. **Activation Constraints**: Drag operations only start after moving the pointer at least 8 pixels, preventing accidental drags when clicking.

3. **Time-based UI Updates**: The "last saved" notification updates in real-time to provide dynamic feedback.

4. **Loading States**: Loading spinners for both document grid and individual images.

5. **ESC Key Modal Closing**: Modals can be closed by pressing the ESC key, with proper event handling.

6. **Improved Spacing**: Cards have optimal spacing to prevent overlapping while maintaining the desired layout.

7. **Optimistic UI Updates**: Using TanStack Query's optimistic updates for an instant feeling interface.

## Architecture

### Frontend Architecture

The frontend follows a component-based architecture:

1. **DocumentGrid**: Main container component that manages the document collection, drag-and-drop logic, and auto-save functionality.

2. **DocumentCard**: Presentational component for individual document cards with click-to-view functionality.

3. **SortableDocumentItem**: Higher-order component that adds drag-and-drop capabilities to DocumentCard.

4. **Services Layer**: 
   - API services for raw data fetching
   - TanStack Query hooks for declarative data fetching, caching, and synchronization

5. **State Management**:
   - Server state managed with TanStack Query
   - UI state managed with React hooks
   - Optimistic updates for a responsive feel

### Backend Architecture

The backend follows a layered architecture:

1. **API Layer**: FastAPI routes defined in `routers/` directory
2. **Data Models**: SQLAlchemy models in `models/` directory
3. **Schemas**: Pydantic schemas for validation in `schemas/` directory
4. **Database**: PostgreSQL with SQLAlchemy ORM

## Hypothetical API Design

For long-term maintenance and to allow adding, removing, and updating elements, I would implement the following API design:

### Key Principles

1. **RESTful Design**: Clear resource-oriented endpoints following REST principles
2. **Versioning**: API versioning to support backward compatibility
3. **Pagination**: Support for paging through large document collections
4. **Filtering & Sorting**: Flexible query parameters for filtering and sorting
5. **Optimistic Concurrency**: Handling concurrent modifications
6. **Comprehensive Documentation**: OpenAPI/Swagger documentation

### Core Endpoints

#### Document Management
- `GET /api/v1/documents` - List documents with pagination, filtering, and sorting
- `POST /api/v1/documents` - Create a new document
- `GET /api/v1/documents/{id}` - Get a specific document
- `PUT /api/v1/documents/{id}` - Update a document
- `PATCH /api/v1/documents/{id}` - Partially update a document
- `DELETE /api/v1/documents/{id}` - Delete a document

#### Document Collections
- `GET /api/v1/collections` - Get document collections/folders
- `POST /api/v1/collections` - Create a new collection
- `PUT /api/v1/collections/{id}` - Update a collection
- `DELETE /api/v1/collections/{id}` - Delete a collection
- `GET /api/v1/collections/{id}/documents` - Get documents in a collection

#### Batch Operations
- `PUT /api/v1/documents/batch` - Update multiple documents (for reordering)
- `POST /api/v1/documents/batch` - Create multiple documents
- `DELETE /api/v1/documents/batch` - Delete multiple documents

#### Document Content & Versioning
- `GET /api/v1/documents/{id}/content` - Get document content
- `PUT /api/v1/documents/{id}/content` - Update document content
- `GET /api/v1/documents/{id}/versions` - List document versions
- `GET /api/v1/documents/{id}/versions/{version_id}` - Get specific version

#### Search
- `GET /api/v1/search` - Search documents by content, metadata, etc.

### Long-term Maintenance Considerations

1. **Schema Evolution**:
   - Use Pydantic models with proper validation
   - Implement database migrations with Alembic
   - Support both old and new schema versions during transitions

2. **Authentication & Authorization**:
   - Implement JWT or OAuth2 authentication
   - Role-based access control (RBAC)
   - Per-document permission model

3. **Rate Limiting & Caching**:
   - Apply rate limits to prevent abuse
   - Use ETags and conditional requests
   - Implement Redis caching for frequently accessed data

4. **Monitoring & Observability**:
   - Logging with structured JSON format
   - Performance metrics collection
   - Health check endpoints

5. **Documentation**:
   - Interactive API documentation with Swagger UI
   - Clear usage examples
   - Change logs for API versions

6. **Error Handling**:
   - Consistent error response format
   - Detailed error messages for debugging
   - Appropriate HTTP status codes

7. **Testing Strategy**:
   - Unit tests for individual components
   - Integration tests for API endpoints
   - End-to-end tests for critical flows
   - Performance tests for scaling

8. **Deployment Strategy**:
   - Blue/Green deployment
   - Feature flags for gradual rollouts
   - Automated rollbacks on failure

## Running the Application

### Using Docker (Recommended)

1. Make sure you have Docker and docker-compose installed
2. Clone the repository
3. Run the application with docker-compose:

```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Development Setup

#### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the backend server:

```bash
uvicorn app.main:app --reload
```

#### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Future Improvements

- Add full-text search functionality for documents
- Implement user authentication and document ownership
- Add document categories and tags
- Support file uploads and document content storage
- Implement document sharing and collaboration features
- Add offline support with local storage
- Implement real-time notifications with WebSockets
- Add comprehensive test suite
- Create a mobile app version 