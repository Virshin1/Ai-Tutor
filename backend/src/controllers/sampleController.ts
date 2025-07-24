import { Request, Response } from 'express';
import Document from '../models/Document';

export const sampleController = (_req: Request, res: Response) => {
  res.json({ message: 'Sample API route working!' });
};

// POST /api/documents
export const saveDocument = async (req: Request, res: Response) => {
  try {
    const { title, content, formData, type } = req.body;
    const doc = new Document({ title, content, formData, type });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save document.' });
  }
};

// GET /api/documents
export const getDocuments = async (_req: Request, res: Response) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};
