import {
  getAllBooks,
  getBookById,
  authorExists,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  const { id, authorId, title, publicationDate } = req.body;

  if (
    !isNonEmptyString(id) ||
    !isNonEmptyString(authorId) ||
    !isNonEmptyString(title) ||
    !isNonEmptyString(publicationDate)
  ) {
    return res.status(400).json({
      message: 'id, authorId, title, and publicationDate are required strings'
    });
  }

  try {
    const existingBook = await getBookById(id.trim());
    if (existingBook) {
      return res.status(400).json({ message: 'A book with that id already exists' });
    }

    const validAuthor = await authorExists(authorId.trim());
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const createdBook = await createBook({
      id: id.trim(),
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate: publicationDate.trim()
    });

    return res.status(201).json(createdBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  const { authorId, title, publicationDate } = req.body;

  if (
    !isNonEmptyString(authorId) ||
    !isNonEmptyString(title) ||
    !isNonEmptyString(publicationDate)
  ) {
    return res.status(400).json({
      message: 'authorId, title, and publicationDate are required strings'
    });
  }

  try {
    const validAuthor = await authorExists(authorId.trim());
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const updatedBook = await updateBook(requestedId, {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate: publicationDate.trim()
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const deleted = await deleteBook(requestedId);

    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};