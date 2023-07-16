/* eslint-disable @typescript-eslint/no-var-requires */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
const app: Application = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://shanikafin:shafin123@book0.5ifc6mn.mongodb.net/books-catalog?retryWrites=true&w=majority';
const client = new MongoClient(uri);

let db: any;
let bookCollection: any;
let userCollection: any;

const run = async () => {
  try {
    await client.connect();
    db = client.db('book-catalog');
    bookCollection = db.collection('book');
    userCollection = db.collection('user');

    app.get('/books', async (req: Request, res: Response) => {
      const cursor = bookCollection.find({});
      const book = await cursor.toArray();

      res.send({ data: book });
    });

    app.post('/book', async (req: Request, res: Response) => {
      const book = req.body;

      const result = await bookCollection.insertOne(book);

      res.send(result);
    });

    app.get('/books/:id', async (req: Request, res: Response) => {
      const id = req.params.id;

      const result = await bookCollection.findOne({ _id: new ObjectId(id) });

      res.send(result);
    });

    app.delete('/books/:id', async (req: Request, res: Response) => {
      const id = req.params.id;

      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });

      res.send(result);
    });

    app.get('/item', async (req, res) => {
      const query = {};
      const cursor = bookCollection.find(query);
      const book = await cursor.toArray();
      res.send(book);
    });

    app.get('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const book = await bookCollection.findOne(query);
      res.send(book);
    });

    app.post('/item', async (req, res) => {
      const newbook = req.body;
      const result = await bookCollection.insertOne(newbook);
      res.send(result);
    });

    app.patch('/books/update/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedBook = req.body;

        const result = await bookCollection.findOneAndUpdate(
          { _id: id },
          { $set: updatedBook },
          { returnOriginal: false }
        );

        if (result.value) {
          res.json({
            statusCode: 200,
            success: true,
            message: 'Book updated successfully',
            data: result.value,
          });
        } else {
          res.status(404).json({
            statusCode: 404,
            success: false,
            message: 'Book not found',
          });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          statusCode: 500,
          success: false,
          message: 'Internal Server Error',
        });
      }
    });

    app.post('/comment/:id', async (req: Request, res: Response) => {
      const bookId = req.params.id;
      const comment = req.body.comment;
      console.log(bookId);
      console.log(comment);

      const result = await bookCollection.updateOne(
        { _id: new ObjectId(bookId) },
        { $push: { comments: comment } }
      );

      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      res.json({ message: 'Comment added successfully' });
    });

    app.get('/comment/:id', async (req: Request, res: Response) => {
      const bookId = req.params.id;

      const result = await bookCollection.findOne(
        { _id: new ObjectId(bookId) },
        { projection: { _id: 0, comments: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    });

    app.post('/user', async (req: Request, res: Response) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });
  } finally {
  }
};

run().catch(err => console.log(err));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
