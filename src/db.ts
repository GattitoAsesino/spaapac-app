import Database from '@tauri-apps/plugin-sql';

//para recordar si hemos abierto la conexion antes
let dbInstance: Database | null = null;

//patron singleton para abrir la conexion a la base de datos
 async function getDb(){
    if (!dbInstance) {
        dbInstance = await Database.load('sqlite:areas.db');
    }
    return dbInstance;  
 }
 //definimos la forma de los datos
 export type Area = {
   id: number;
   nombre: string;
   color: string;
   avatar_tipo: string;
   tiempo_total_acumulado: number;
   nivel_actual: number;
   xp_actual: number;
   fecha_creacion: string;
 };
 //primera funcion que exportamos
    export async function getAreas(): Promise<Area[]> {
        const db = await getDb();
        return db.select('SELECT * FROM areas ORDER BY fecha_creacion DESC') as Promise<Area[]>;
    }

//crear areas
export async function createArea(nombre: string, color: string, avatar_tipo: string){
    const db = await getDb();
    await db.execute(
        'INSERT INTO areas (nombre, color, avatar_tipo) VALUES ($1, $2, $3)',
         [nombre, color, avatar_tipo]);
}
//actualizar areas
export async function updateArea(id: number, nombre: string, color:string, avatar_tipo:string){
    const db = await getDb();
    await db.execute(
        'UPDATE areas SET nombre=$2, color=$3, avatar_tipo=$4 WHERE id= $1',
         [id, nombre, color, avatar_tipo]);
}
//borrar areas
export async function deleteArea(id: number){
    const db = await getDb();
    await db.execute(
        'DELETE FROM areas WHERE id=$1',
         [id]);
}