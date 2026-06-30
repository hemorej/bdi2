// Simple local Express server for the BDI-II quiz app.
// Run with: node server.js
// Then open: http://localhost:3000

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RESULTS_DIR = path.join(__dirname, 'results');

// Make sure the results folder exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Serve minified production assets from dist/ if they've been built
// (npm run build), otherwise fall back to the raw files in public/.
const DIST_DIR = path.join(__dirname, 'dist');
const STATIC_DIR = fs.existsSync(DIST_DIR)
  ? DIST_DIR
  : path.join(__dirname, 'public');

app.use(express.json({ limit: '256kb' }));
app.use(express.static(STATIC_DIR, { maxAge: '1d' }));

// Save a completed quiz result as a JSON file in ./results/
app.post('/api/results', (req, res) => {
  try {
    const body = req.body || {};
    if (!Array.isArray(body.answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    const now = new Date();
    const iso = now.toISOString();
    // Filename uses the timestamp so files sort naturally on disk.
    const safeStamp = iso.replace(/[:.]/g, '-');
    const filename = `bdi2-${safeStamp}.json`;
    const filePath = path.join(RESULTS_DIR, filename);

    const totalScore = body.answers.reduce(
      (sum, a) => sum + (Number(a && a.score) || 0),
      0
    );

    const record = {
      id: filename.replace(/\.json$/, ''),
      takenAt: iso,
      totalScore,
      severity: body.severity || null,
      answers: body.answers,
      note: body.note || null,
      meta: {
        questionCount: body.answers.length,
        skippedQuestion9: true,
        maxPossibleScore: 60
      }
    };

    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
    res.json({ ok: true, id: record.id, file: filename, totalScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// List past results sorted by takenAt descending.
app.get('/api/results', (_req, res) => {
  try {
    const files = fs
      .readdirSync(RESULTS_DIR)
      .filter((f) => f.endsWith('.json'));

    const items = files
      .map((f) => {
        try {
          const raw = fs.readFileSync(path.join(RESULTS_DIR, f), 'utf8');
          const data = JSON.parse(raw);
          return {
            id: data.id || f.replace(/\.json$/, ''),
            file: f,
            takenAt: data.takenAt,
            totalScore: data.totalScore,
            severity: data.severity
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (a.takenAt < b.takenAt ? 1 : -1));

    res.json({ results: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read results' });
  }
});

// Get a single result's full JSON.
app.get('/api/results/:id', (req, res) => {
  try {
    const id = req.params.id.replace(/[^a-zA-Z0-9_\-]/g, '');
    const filePath = path.join(RESULTS_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    res.type('application/json').send(raw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read result' });
  }
});

app.listen(PORT, () => {
  console.log(`BDI-II app running at http://localhost:${PORT}`);
  console.log(`Results saved to: ${RESULTS_DIR}`);
});
