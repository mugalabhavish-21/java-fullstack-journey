const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: 'Sample Item', completed: false },
];

app.get('/api/items', (req, res) => {
  res.json({ success: true, data: items });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  res.json({ success: true, data: item });
});

app.post('/api/items', (req, res) => {
  const { name, completed = false } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  const newItem = {
    id: Date.now(),
    name,
    completed,
  };

  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const { name, completed } = req.body;

  if (name !== undefined) item.name = name;
  if (completed !== undefined) item.completed = completed;

  res.json({ success: true, data: item });
});

app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const deletedItem = items.splice(index, 1)[0];
  res.json({ success: true, data: deletedItem });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
