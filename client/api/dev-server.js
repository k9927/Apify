const app = require('./server');

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
