import app from './app.js';

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Container accessible at http://0.0.0.0:${port}`);
});
