import express from 'express';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import './config/database'; // Add this line

const app = express();

// Load all routes
const loadRoutes = (routesPath: string, prefix = '') => {
  readdirSync(routesPath).forEach((file) => {
    const fullPath = join(routesPath, file);
    if (statSync(fullPath).isDirectory()) {
      loadRoutes(fullPath, `${prefix}/${file}`);
    } else {
      const route = require(fullPath);
      let path = `${prefix}/${file.replace('.ts', '')}`;
      if (file === 'index.ts') {
        path = `${prefix}`;
      }
      app.use(path, route.default);
    }
  });
};

loadRoutes(join(__dirname, 'routes'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});