# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 💬 Integration with Telegram bot for contact form notifications
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Telegram Bot Configuration
# Get your bot token from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Get your chat ID from @userinfobot on Telegram
TELEGRAM_CHAT_ID=your_chat_id_here

# Server Port (default: 3000)
PORT=3001
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Telegram Bot Integration

The application includes integration with Telegram bot for processing contact form submissions and service orders.

### Setting up Telegram Bot

1. Find @BotFather in Telegram and create a new bot using `/newbot` command
2. Get your bot token from @BotFather
3. Find @userinfobot in Telegram to get your chat ID
4. Add these values to your `.env` file as described above

Once configured, form submissions and service orders will be sent to your Telegram bot.

### Using the Service Order Feature

The application provides two ways to order services:

1. **From the Services Catalog Page**: Click the "Заказать" button on any service card to open a modal form
2. **From Individual Service Pages**: Click the "Заказать услугу" button on any detailed service page

Both methods will open a modal form where users can fill in their contact information and submit an order request. The request will be sent to your Telegram bot with information about the requested service.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
