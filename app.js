const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection
const db = new Pool({
  user: 'postgres',     // use your PostgreSQL user
  host: 'localhost',
  database: 'vlogs',
  password: 'Sohan@2004',         // your PostgreSQL password
  port: 5432,
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vlogs ORDER BY created_at DESC');
    res.render('index', { vlogs: result.rows });
  } catch (err) {
    res.send('Database error');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query('INSERT INTO vlogs (title, content) VALUES ($1, $2)', [title, content]);
    res.redirect('/');
  } catch (err) {
    res.send('Database insert error');
  }
});

app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM vlogs WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    res.send('Database delete error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});