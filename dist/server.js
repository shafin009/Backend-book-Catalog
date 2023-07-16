"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const uri = 'mongodb+srv://shanikafin:shafin123@book0.5ifc6mn.mongodb.net/books-catalog?retryWrites=true&w=majority';
const client = new mongodb_1.MongoClient(uri);
let db;
let bookCollection;
let userCollection;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        db = client.db('book-catalog');
        bookCollection = db.collection('book');
        userCollection = db.collection('user');
        app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const cursor = bookCollection.find({});
            const book = yield cursor.toArray();
            res.send({ data: book });
        }));
        app.post('/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const book = req.body;
            const result = yield bookCollection.insertOne(book);
            res.send(result);
        }));
        app.get('/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const result = yield bookCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            res.send(result);
        }));
        app.delete('/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const result = yield bookCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            res.send(result);
        }));
        app.get('/item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const query = {};
            const cursor = bookCollection.find(query);
            const book = yield cursor.toArray();
            res.send(book);
        }));
        app.get('/item/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = req.params.id;
            const query = { _id: new mongodb_1.ObjectId(id) };
            const book = yield bookCollection.findOne(query);
            res.send(book);
        }));
        app.post('/item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const newbook = req.body;
            const result = yield bookCollection.insertOne(newbook);
            res.send(result);
        }));
        app.patch('/books/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const updatedBook = req.body;
                const result = yield bookCollection.findOneAndUpdate({ _id: id }, { $set: updatedBook }, { returnOriginal: false });
                if (result.value) {
                    res.json({
                        statusCode: 200,
                        success: true,
                        message: 'Book updated successfully',
                        data: result.value,
                    });
                }
                else {
                    res.status(404).json({
                        statusCode: 404,
                        success: false,
                        message: 'Book not found',
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: 'Internal Server Error',
                });
            }
        }));
        app.post('/comment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const bookId = req.params.id;
            const comment = req.body.comment;
            console.log(bookId);
            console.log(comment);
            const result = yield bookCollection.updateOne({ _id: new mongodb_1.ObjectId(bookId) }, { $push: { comments: comment } });
            if (result.modifiedCount !== 1) {
                console.error('Product not found or comment not added');
                res.json({ error: 'Product not found or comment not added' });
                return;
            }
            res.json({ message: 'Comment added successfully' });
        }));
        app.get('/comment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const bookId = req.params.id;
            const result = yield bookCollection.findOne({ _id: new mongodb_1.ObjectId(bookId) }, { projection: { _id: 0, comments: 1 } });
            if (result) {
                res.json(result);
            }
            else {
                res.status(404).json({ error: 'Product not found' });
            }
        }));
        app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.body;
            const result = yield userCollection.insertOne(user);
            res.send(result);
        }));
    }
    finally {
    }
});
run().catch(err => console.log(err));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
