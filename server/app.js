const express = require('express');
const path = require('path');


const app = express();
const port = 8080;
// const port = 3000;

app.use(express.static(path.join(__dirname, '../dist')));

// Again not entirely sure, but I think this is important
app.use(express.json());
// app.use(cors());


app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening at ${process.env.PGHOST} on port ${port}`);
  }
});

app.get('/hello', (req, res) => res.send('hi'))

// ROUTING FOR ALL ROUTES
const mountAllRoutes = require('./router');

mountAllRoutes(app);

app.get('/hello', (req, res) => res.send('hi'))
