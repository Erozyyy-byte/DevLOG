const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
// Assuming you have your index.html in the 'public' folder
app.use(express.static(path.join(__dirname,)));

const DATA_FILE = path.join(__dirname, 'logs.json');

if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));

app.get('/api/logs', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
});

app.post('/api/logs', (req, res) => {
    const logs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    logs.unshift(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(logs, null, 2));
    res.status(201).json({ message: "Saved" });
});

app.delete('/api/logs/:id', (req, res) => {
    let logs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    logs = logs.filter(l => l.id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(logs, null, 2));
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`🚀 DevLog running at http://localhost:${PORT}`));