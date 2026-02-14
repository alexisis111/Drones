import express from 'express';
import { createRequestListener } from '@react-router/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express server
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the build/client directory
app.use(express.static(path.join(__dirname, 'build', 'client')));

// Import and use the Telegram webhook API
// Note: We'll need to create this route in the build directory after compilation
// For now, we'll add it conditionally if the module exists
try {
  const telegramWebhook = await import('./build/server/src/api/telegram-webhook.js');
  app.use('/api', telegramWebhook.default);
} catch (err) {
  console.warn('Telegram webhook API not found, skipping...');
  // Fallback: basic API route for testing
  app.use('/api/telegram-webhook', (req, res) => {
    console.log('Received form data:', req.body);
    res.json({ 
      success: true, 
      message: 'Сообщение получено (Telegram integration not configured)' 
    });
  });
}

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