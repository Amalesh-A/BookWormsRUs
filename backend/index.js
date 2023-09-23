import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookmodel.js";

const app = express();

//middleware for parsing request body
app.use(express.json());
 
app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to our Bookstore!')
});  //get is the http method that generally used for getting a resource from server
 
//route tro save a new book
app.post('/books', async (request, response) => {
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook);
        return response.status(201).send(book);
    }
    catch (error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

//route to get all books from database
app.get('/books', async (request, response) => {
    try{
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route to get one book from database by its id
app.get('/books/:id', async (request, response) => {
    try{

        const { id } = request.params;
        
        const bk = await Book.findById(id);
        
        return response.status(200).json(bk);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route to update a book
app.put('/books/:id', async (request, response) => {
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const { id } = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);
        if(!result) {
            return response.status(404).json({ message: "Oops, We don't have that book :/"});
        }
        return response.status(200).json({ message: "Successfully updated!"});
    }   catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
});

//route to delete the book
app.delete('/books/:id', async (request, response) => {
    try{
        const { id } = request.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result) {
            return response.status(404).json({message: "Oops, We don't have that book :/"});
        }
        return response.status(200).json({ message: "Successfully deleted!"});
    }catch (error){
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
})

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App is connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`); //error faced: printed ${PORT} instead of 5555 because I used '' instead of backticks ``
        });
    })
    .catch((error) => {
        console.log(error);

    });