//explicet requirement
const express = require('express');

// expresss app
const app = express();

// listens for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

app.get('/', (req, res) => {
  // res.send('<p>home page</p>');
  res.sendFile('./views/index.html', { root: __dirname });
});

app.get('/about', (req, res) => {
  // res.send('<p>about page</p>'); //auto html
  res.sendFile('./views/about.html', { root: __dirname });
});

// redirected
app.get('/about-us', (req, res) => {
  res.redirect('/about');
});

// 404 page error
app.use((req, res) => {
  res.status(404).sendFile('./views/404.html', { root: __dirname });
});