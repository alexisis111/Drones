import express from 'express';
import { createRequestListener } from '@react-router/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express server
const app = express();

// Serve static files from the build/client directory
app.use(express.static(path.join(__dirname, 'build', 'client')));

// Redirect old domain to new domain
app.use((req, res, next) => {
  if (req.headers.host.includes('xn--80affa3aj.xn--p1ai')) {
    const newPath = req.protocol + '://' + 'xn--80afglc.xn--p1ai' + req.originalUrl;
    res.redirect(301, newPath);
  } else {
    next();
  }
});

// Handle all other routes with React Router
app.all(
  '*',
  createRequestListener({
    build: await import('./build/server/server-build.js'),
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});