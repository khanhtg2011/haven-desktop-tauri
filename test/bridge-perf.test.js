const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('Tauri Cargo.toml configures size/LTO release profile', () => {
  const cargoToml = fs.readFileSync(path.join(ROOT, 'src-tauri', 'Cargo.toml'), 'utf8');
  assert.match(cargoToml, /\[profile\.release\]/);
  assert.match(cargoToml, /opt-level\s*=\s*"z"/);
  assert.match(cargoToml, /lto\s*=\s*true/);
  assert.match(cargoToml, /codegen-units\s*=\s*1/);
  assert.match(cargoToml, /panic\s*=\s*"abort"/);
  assert.match(cargoToml, /strip\s*=\s*true/);
});

test('Tauri workflow enforces prerelease gate on main', () => {
  const wf = fs.readFileSync(
    path.join(ROOT, '.github', 'workflows', 'build-tauri.yml'),
    'utf8'
  );
  assert.match(wf, /branches:\s*\r?\n\s*-\s*main/);
  assert.match(wf, /prerelease:\s*true/);
});

test('Tauri bridge coalesces MutationObserver and voice overlay IPC with requestAnimationFrame', () => {
  const bridgeJs = fs.readFileSync(
    path.join(ROOT, 'src', 'tauri-bridge', 'haven-bridge.js'),
    'utf8'
  );
  assert.ok(
    !bridgeJs.includes('new MutationObserver(purgeModals)'),
    'MutationObserver must not run purgeModals synchronously on every DOM mutation'
  );
  assert.match(bridgeJs, /MutationObserver\(schedulePurge\)/);
  assert.match(bridgeJs, /requestAnimationFrame/);
  assert.match(bridgeJs, /scheduleOverlayTick/);

  const match = bridgeJs.match(/function coalesceFrame\(fn\)\s*\{[\s\S]*?\r?\n\s{2}\}/);
  assert.ok(match, 'haven-bridge.js should define coalesceFrame helper');

  const queued = [];
  const makeCoalescer = new Function(
    'requestAnimationFrame',
    `${match[0]}\nreturn coalesceFrame;`
  );
  const coalesce = makeCoalescer((cb) => {
    queued.push(cb);
    return queued.length;
  });

  let runs = 0;
  const trigger = coalesce(() => {
    runs += 1;
  });

  for (let i = 0; i < 50; i += 1) {
    trigger();
  }
  assert.strictEqual(runs, 0);
  assert.strictEqual(queued.length, 1);
  queued.shift()();
  assert.strictEqual(runs, 1);
});
