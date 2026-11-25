# Haven Desktop (Tauri v2 Edition)

An ultra-lightweight desktop client for **Haven**, built on **Tauri v2 + Rust** and Windows **WebView2** with an isolated PC preload bridge (`src/tauri-bridge/haven-bridge.js`) and a pure native Win32 GDI+ click-through gaming HUD overlay.

---

## Key Features

- **Native Win32 GDI+ Voice & Chat HUD Overlay (`src-tauri/src/`):**
  - Click-through, zero-WebView2 transparent overlay rendered directly in GDI+ for borderless/fullscreen games (`Ctrl+Shift+O` to toggle).
- **Gaming Performance & Low Memory Footprint:**
  - Dynamic Win32 process/thread priority management and recursive WebView2 process-tree working-set trimming (`tray.rs`).
  - `requestAnimationFrame` IPC coalescing (`coalesceFrame`) batching DOM promo observer mutations and voice overlay telemetry updates (`16 ms` pacing).
  - Compact LTO release profile (`opt-level = "z"`, `lto = true`, `codegen-units = 1`, `panic = "abort"`, `strip = true`).
- **Desktop UX Parity:**
  - Triple-layer microphone/camera auto-permissions, system tray controls, single-instance lock, and native file download interception.

---

## Companion Haven Repositories

- [`haven-desktop`](https://github.com/khanhtg2011/haven-desktop) — Legacy Electron Desktop client (`main`)
- [`haven-mobile`](https://github.com/khanhtg2011/haven-mobile) — Tauri v2 Android client with Mobile Focus View UI
- [`haven-native`](https://github.com/khanhtg2011/haven-native) — 100% Pure Rust Slint client (Zero WebView2)

---

## Development & Testing

```powershell
# Install Tauri CLI dependency
npm install --ignore-scripts

# Run bridge & release profile checks
npm test

# Type-check Rust backend
cargo check --manifest-path src-tauri/Cargo.toml

# Run in dev mode or build Windows installer
npm run tauri:dev
npm run tauri:build
```

## License

AGPL-3.0
