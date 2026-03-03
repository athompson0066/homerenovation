import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get('/api/configs', (req, res) => {
    try {
      const configs = db.prepare('SELECT id, name FROM configs ORDER BY updated_at DESC').all();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch configs' });
    }
  });

  app.get('/api/configs/:id', (req, res) => {
    try {
      const config = db.prepare('SELECT * FROM configs WHERE id = ?').get(req.params.id);
      if (config) {
        res.json({ ...config, data: JSON.parse(config.data as string) });
      } else {
        res.status(404).json({ error: 'Config not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch config' });
    }
  });

  app.post('/api/configs', (req, res) => {
    const { id, name, data } = req.body;
    if (!id || !name || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO configs (id, name, data, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          data = excluded.data,
          updated_at = CURRENT_TIMESTAMP
      `);
      stmt.run(id, name, JSON.stringify(data));
      res.json({ success: true });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ error: 'Failed to save config' });
    }
  });

  app.delete('/api/configs/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM configs WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete config' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
