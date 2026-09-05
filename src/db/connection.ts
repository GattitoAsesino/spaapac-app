import Database from '@tauri-apps/plugin-sql';

//para recordar si hemos abierto la conexion antes
let dbInstance: Database | null = null;

//patron singleton para abrir la conexion a la base de datos
export async function getDb(){
    if (!dbInstance) {
        dbInstance = await Database.load('sqlite:areas.db');
    }
    return dbInstance;  
 }