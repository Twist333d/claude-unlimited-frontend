const fs = require('fs');
const path = require('path');

const includePatterns = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', '.svg', '.md'];
const importantPatterns = ['README', 'package.json', 'webpack.config', '.gitignore', '.env', '.prettierrc', 'cypress.config'];
const excludeDirs = new Set(['node_modules', '.git', '.idea', 'build', 'dist', 'coverage']);

function matchesPatterns(file, patterns) {
  return patterns.some(pattern => file.endsWith(pattern) || file.startsWith(pattern));
}

function generateStructure(rootDir, outputFile) {
  const structure = [];

  function traverseDir(dir, level) {
    const files = fs.readdirSync(dir);
    const relevantItems = files.filter(file => {
      const fullPath = path.join(dir, file);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      return isDirectory || matchesPatterns(file, includePatterns) || matchesPatterns(file, importantPatterns);
    });

    relevantItems.forEach(item => {
      const fullPath = path.join(dir, item);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      const indent = '    '.repeat(level);

      if (isDirectory && !excludeDirs.has(item)) {
        structure.push(`${indent}${item}/`);
        traverseDir(fullPath, level + 1);
      } else if (!isDirectory) {
        structure.push(`${indent}${item}`);
      }
    });
  }

  traverseDir(rootDir, 0);
  fs.writeFileSync(outputFile, structure.join('\n'));
  console.log(`✓ Project structure has been written to ./${path.relative(rootDir, outputFile)}`);
}

generateStructure(process.cwd(), 'frontend_directory_structure.txt');