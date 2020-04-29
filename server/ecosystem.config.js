module.exports = {
  apps: [
    {
      name: 'sync-server',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3388,
      },
    },
  ],

  deploy: {
    production: {
      user: 'travis',
      host: '51.15.124.103',
      // ref: 'origin/master',
      ref: 'origin/ios',
      repo: 'git@github.com:98o718/sync.git',
      path: '/home/travis/sync-server',
      'post-deploy':
        'cd server && yarn && pm2 reload ecosystem.config.js --env production',
    },
  },
}
