// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[cfg(target_os = "windows")]
use window_shadows::set_shadow;

#[cfg(target_os = "windows")]
use window_vibrancy::apply_mica;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app: &mut tauri::App| {
            let window = app.get_window("main").unwrap();

            let mode = dark_light::detect();

            let is_dark = match mode {
                dark_light::Mode::Dark => true,
                dark_light::Mode::Light => false,
                // Unspecified
                dark_light::Mode::Default => false,
            };

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, Some(is_dark)).expect("Failed to apply mica");

            #[cfg(any(windows, target_os = "windows"))]
            set_shadow(&window, true).expect("Failed to set shadow");

            // This is a workaround for applying mica and shadow on Windows
            window.minimize().unwrap();
            window.unminimize().unwrap();
            window.maximize().unwrap();
            window.unmaximize().unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
