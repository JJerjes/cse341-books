import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collections = db.collection('books');
  const books = await collections.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId });
  return Boolean(author);
};

const createBook = async (bookData) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(bookData);
  const createdBook = await collection.findOne({ id: bookData.id });
  return createdBook;
};

const updateBook = async (bookId, bookData) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.updateOne(
    { id: bookId },
    {
      $set: {
        authorId: bookData.authorId,
        title: bookData.title,
        publicationDate: bookData.publicationDate
      }
    }
  );

  if (result.matchedCount === 0) {
    return null;
  }

  const updatedBook = await collection.findOne({ id: bookId });
  return updatedBook;
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });
  return result.deletedCount > 0;
};

export {
  getAllBooks,
  getBookById,
  authorExists,
  createBook,
  updateBook,
  deleteBook
 };