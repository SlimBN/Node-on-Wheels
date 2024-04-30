import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();
const listRoutes = (routesPath: string, prefix = ''): void => {
  readdirSync(routesPath).forEach((file) => {
    const fullPath = join(routesPath, file);
    if (statSync(fullPath).isDirectory()) {
      listRoutes(fullPath, `${prefix}/${file}`);
    } else {
      const sourceFile = project.addSourceFileAtPath(fullPath);
      const descendants = sourceFile.getDescendants();
      const callExpressions = descendants.filter(descendant => descendant.getKind() === SyntaxKind.CallExpression);
      const methods = callExpressions.map(call => {
        const expression = call.getChildAtIndex(0).getText();
        if (expression.startsWith('router.')) {
          return expression.split('.')[1];
        }
      }).filter(Boolean);
      methods.forEach((method: string | undefined) => {
        console.log(`${method?.toUpperCase()}: ${prefix}/${file.replace('.ts', '')}`);
      });
    }
  });
};

listRoutes(join(__dirname, '../routes'));