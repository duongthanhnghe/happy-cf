import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      content = content.replace(
        /from\s+(['"])(\.{1,2}\/[^'"]+)\1/g,
        (match, quote, importPath) => {
          // Bỏ phần mở rộng .ts nếu có
          if (importPath.endsWith('.ts')) {
            importPath = importPath.slice(0, -3);
          }
          // Chỉ thêm .js nếu chưa có .js hoặc .json
          if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
            importPath += '.js';
          }
          return `from ${quote}${importPath}${quote}`;
        }
      );

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixImports('./dist/server');
console.log('✅ Đã thêm .js vào import nội bộ (đã xử lý cả .ts -> .js)');
