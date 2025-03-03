// Document type interface
export interface Document {
  id: number;
  type: string;
  title: string;
  position: number;
}

// Document thumbnail mapping type
export interface ThumbnailMapping {
  [key: string]: string;
}
