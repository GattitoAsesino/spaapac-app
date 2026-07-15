use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "crear tablas iniciales",
            sql: "
                CREATE TABLE areas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    color TEXT NOT NULL,
                    avatar_tipo TEXT NOT NULL,
                    tiempo_total_acumulado INTEGER NOT NULL DEFAULT 0,
                    nivel_actual INTEGER NOT NULL DEFAULT 1,
                    xp_actual INTEGER NOT NULL DEFAULT 0,
                    fecha_creacion TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE sesiones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    area_id INTEGER NOT NULL REFERENCES areas(id),
                    inicio TEXT NOT NULL,
                    fin TEXT,
                    duracion_real INTEGER NOT NULL DEFAULT 0,
                    tipo TEXT NOT NULL DEFAULT 'libre',
                    completada INTEGER NOT NULL DEFAULT 0
                );

                CREATE TABLE bloque_config (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    area_id INTEGER NOT NULL REFERENCES areas(id),
                    duracion_minutos INTEGER NOT NULL,
                    descanso_minutos INTEGER NOT NULL DEFAULT 0
                );

                CREATE TABLE bloques_planificados (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    area_id INTEGER NOT NULL REFERENCES areas(id),
                    semana_inicio TEXT NOT NULL,
                    duracion_minutos INTEGER NOT NULL,
                    estado TEXT NOT NULL DEFAULT 'pendiente',
                    sesion_id INTEGER REFERENCES sesiones(id)
                );

                CREATE TABLE metas_semanales (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    area_id INTEGER NOT NULL REFERENCES areas(id),
                    semana_inicio TEXT NOT NULL,
                    horas_objetivo REAL NOT NULL DEFAULT 0
                );
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:areas.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}