import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 5000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

app.use(cors())
app.use(express.json())

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      department VARCHAR(100) NOT NULL,
      salary NUMERIC(12, 2) NOT NULL
    )
  `)
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM employees')
  if (rows[0].count === 0) {
    await pool.query(
      `INSERT INTO employees (name, email, department, salary)
       VALUES
       ('Bhavish Chary', 'bhavish@gmail.com', 'IT', 45000),
       ('Rahul Kumar', 'rahul@gmail.com', 'HR', 40000),
       ('Priya Sharma', 'priya@gmail.com', 'Finance', 50000)`,
    )
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

app.get('/api/employees', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM employees ORDER BY id DESC')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, department, salary } = req.body
    const { rows } = await pool.query(
      'INSERT INTO employees (name, email, department, salary) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, department, salary],
    )
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(400).json({ message: error.code === '23505' ? 'Email already exists' : error.message })
  }
})

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, email, department, salary } = req.body
    const { rows } = await pool.query(
      'UPDATE employees SET name=$1, email=$2, department=$3, salary=$4 WHERE id=$5 RETURNING *',
      [name, email, department, salary, req.params.id],
    )
    if (!rows[0]) return res.status(404).json({ message: 'Employee not found' })
    res.json(rows[0])
  } catch (error) {
    res.status(400).json({ message: error.code === '23505' ? 'Email already exists' : error.message })
  }
})

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id])
    if (!result.rowCount) return res.status(404).json({ message: 'Employee not found' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

initDb()
  .then(() => app.listen(port, () => console.log(`Management API running on port ${port}`)))
  .catch((error) => {
    console.error('Database initialization failed:', error)
    process.exit(1)
  })
