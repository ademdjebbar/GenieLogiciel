const { spawn } = require('child_process');
const path = require('path');

function run(command, cwd, prefix, color) {
  const child = spawn(command, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    stdio: 'pipe'
  });

  child.stdout.on('data', (data) => process.stdout.write(`\x1b[${color}m[${prefix}]\x1b[0m ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`\x1b[${color}m[${prefix} ERROR]\x1b[0m ${data}`));

  return child;
}

console.log("\x1b[32m🚀 Démarrage de Priora Fullstack...\x1b[0m\n");

// Démarrer DB Push/Generate puis Backend
const backendPush = spawn('npx prisma db push', { cwd: path.resolve(__dirname, 'backend'), shell: true });
backendPush.on('close', () => {
    run('npm run dev', 'backend', 'BACKEND', '34'); // Blue
});

// Démarrer Frontend
setTimeout(() => {
    run('npm run dev', 'frontend', 'FRONTEND', '35'); // Magenta
}, 2000);

process.stdin.resume();
