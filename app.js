//explicet requirement
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// expresss app
const app = express();

//connecting to mongoDB
const dbURI = "mongodb+srv://dmatz1:<HandM3Down>@cluster0.1pm6ynz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// listens for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');


// middleware / static files
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);//localhost
  console.log('path: ', req.path);//path
  console.log('method: ', req.method);//method
  next();//invoke and move on
});

//example
app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});
//morgan
app.use(morgan('dev'));
//
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

//info
app.get('/', (req, res) => {
    const blogs = [
      {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    ];
    res.render('index', { title: 'Home', blogs });
  });
  
  //redirected
  app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
  });
  
  //created
  app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
  });
  
  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });