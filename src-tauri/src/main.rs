// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

use window_shadows::set_shadow;
use window_vibrancy::apply_mica;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app: &mut tauri::App| {
            let window = app.get_window("main").unwrap();

            let mode = dark_light::detect();

            let is_dark = match mode {
                // Dark mode
                dark_light::Mode::Dark => true,
                // Light mode
                dark_light::Mode::Light => false,
                // Unspecified
                dark_light::Mode::Default => false,
            };

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
