
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/testy', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(PORT))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
    res.redirect('/blogs');
});
  
  app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
