module.exports = {
  apps: [
    {
      name: 'legion-web',
      script: './server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 100,        // Мгновенный рестарт (100мс)
      min_uptime: '5s',          // Сервис стабилен после 5 сек работы
      max_restarts: 1000,        // Максимум рестартов
      max_memory_restart: '1G',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_file: './logs/web-combined.log',
      time: true,
      merge_logs: true
    },
    {
      name: 'legion-api',
      script: './api-server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 100,        // Мгновенный рестарт (100мс)
      min_uptime: '5s',          // Сервис стабилен после 5 сек работы
      max_restarts: 1000,        // Максимум рестартов
      max_memory_restart: '512M',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      merge_logs: true
    },
    {
      name: 'legion-ai',
      script: './server.js',
      cwd: './ai-assistant',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 100,        // Мгновенный рестарт (100мс)
      min_uptime: '5s',          // Сервис стабилен после 5 сек работы
      max_restarts: 1000,        // Максимум рестартов
      max_memory_restart: '512M',
      watch: false,
      env: {
        NODE_ENV: 'production',
        AI_ASSISTANT_PORT: 3002
      },
      error_file: '../logs/ai-error.log',
      out_file: '../logs/ai-out.log',
      log_file: '../logs/ai-combined.log',
      time: true,
      merge_logs: true
    }
  ]
};
