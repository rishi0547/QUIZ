const fs = require('fs');
const path = require('path');

const folderToDelete = path.join(__dirname, 'website');

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log('✓ Nested website folder deleted successfully');
    return true;
  } else {
    console.log('✓ No website folder found to delete');
    return false;
  }
}

// Execute
deleteFolder(folderToDelete);

// Verify
console.log('\nFiles after cleanup:');
fs.readdirSync(__dirname)
  .filter(file => !file.startsWith('.'))
  .forEach(file => {
    const fullPath = path.join(__dirname, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    console.log(`  ${isDir ? '[DIR]' : '[FILE]'} ${file}`);
  });

console.log('\n✓ Cleanup complete!');
