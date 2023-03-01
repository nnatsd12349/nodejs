//explicet requirement
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./model/blog');

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
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


//mongooos and mongo sandbox routes
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog',
    snippet: 'about new blog',
    body: 'more about new blog'
  })
//further test
  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err); //catch error
    });
});
//get all blogs
app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});
//get single blog
app.get('/single-blog', (req, res) => {
  Blog.findById('1yz1pUTFOGeUwsFe0lDhL89D')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});
//redirect to blog folder
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

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
app.get('/', (req, res) => {//separate from normal roots
    res.redirect('/blogs');
  });
  
  //redirected
  app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
  });

  //post
  app.post('/blogs', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);
  
    blog.save()
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
  });

  //blog ID specific (always colon)
  app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });

  //request to delete blog
  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id; //access by id
    
    Blog.findByIdAndDelete(id)//passing id
      .then(result => {
        res.json({ redirect: '/blogs' });//json to browser / redirect
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  //created
  app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
  });
  
  //
  app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });

  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });