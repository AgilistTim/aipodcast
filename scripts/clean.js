import { rm } from 'fs/promises';
import { join } from 'path';

async function clean() {
  try {
    console.log('Cleaning build directories...');
    
    const dirs = [
      join(process.cwd(), 'dist'),
      join(process.cwd(), 'node_modules', '.vite')
    ];

    for (const dir of dirs) {
      try {
        await rm(dir, { recursive: true, force: true });
        console.log(`Successfully removed ${dir}`);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.warn(`Warning: Could not remove ${dir}:`, err.message);
        }
      }
    }
    
    console.log('Clean completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}