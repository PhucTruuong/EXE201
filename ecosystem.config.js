module.exports = {
  apps: [{
    name: "fureverfriend-app", // Replace with your actual application name
    script: "npm", // Use npm to run the script
    args: "run start:prod", // Specify the production script (assuming "start:prod")
    cwd: "/tmp/EXE201", // Working directory on the VPS where your project is deployed
    watch: ["!./node_modules/**", "./src/**", "./main.ts"], // Watch relevant directories for changes
    instances: 1, // Number of instances to create
    autorestart: true, // Restart on failure
    max_memory_restart: "1G", // Restart if more than 1GB of memory is used
    env: {
      NODE_ENV: "production", // Set the production environment
    },
  }],
  deploy: {
    production: {
      key: "/home/ubuntu/.ssh/authorized_keys",
      user: "ubuntu", // Username with deployment permissions
      host: "13.229.136.248", // Your EC2 instance IP address
      ref: "origin/main", // Git branch to deploy
      repo: "https://github.com/PhucTruuong/EXE201.git", // Your Git repository URL
      path: "/tmp/EXE201", // Deployment path on the VPS (should match working directory)
      'pre-deploy-local': "", // No pre-deployment tasks needed locally
      'post-deploy': 'npm ci && pm2 reload ecosystem.config.js --env production', // Install dependencies and reload PM2
      'pre-setup': "", // No pre-setup tasks needed on the server
    }
  }
};