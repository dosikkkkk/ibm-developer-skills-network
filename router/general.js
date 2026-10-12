const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({message: err}));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    let results = [];
    for (let id in books) {
      if (books[id].author === author) {
        results.push({"isbn": id, "author": books[id].author, "title": books[id].title, "reviews": books[id].reviews});
      }
    }
    if (results.length > 0) resolve(results);
    else reject("Author not found");
  })
  .then((data) => res.status(200).json({booksbyauthor: data}))
  .catch((err) => res.status(404).json({message: err}));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let results = [];
    for (let id in books) {
      if (books[id].title === title) {
        results.push({"isbn": id, "author": books[id].author, "title": books[id].title, "reviews": books[id].reviews});
      }
    }
    if (results.length > 0) resolve(results);
    else reject("Title not found");
  })
  .then((data) => res.status(200).json({booksbytitle: data}))
  .catch((err) => res.status(404).json({message: err}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
