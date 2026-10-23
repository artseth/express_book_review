const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const BASE_URL = "http://localhost:5000";

// Register a new user

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// Task 10: Get the book list available in the shop

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
   
    return res.status(200).json(books);
  }
});


// Task 11: Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on Author

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    const allBooks = response.data;
    const result = {};
    Object.keys(allBooks).forEach((isbn) => {
      if (allBooks[isbn].author === author) {
        result[isbn] = allBooks[isbn];
      }
    });
    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ message: "No books found by this author" });
  } catch (error) {

    const result = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        result[isbn] = books[isbn];
      }
    });
    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ message: "No books found by this author" });
  }
});


// Task 13: Get all books based on Title

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    const allBooks = response.data;
    const result = {};
    Object.keys(allBooks).forEach((isbn) => {
      if (allBooks[isbn].title === title) {
        result[isbn] = allBooks[isbn];
      }
    });
    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {

    const result = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        result[isbn] = books[isbn];
      }
    });
    if (Object.keys(result).length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ message: "No books found with this title" });
  }
});


// Get book review

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;