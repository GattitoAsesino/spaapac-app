import { useEffect, useState } from "react";
import Database from '@tauri-apps/plugin-sql';

function App() {
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      const db = await Database.load('sqlite:areas.db');
      const result = await db.select('SELECT * FROM areas');
      console.log(result);
      setAreas(result as any[]);
    }
    cargarDatos();
  }, []);

  return (
    <div>
      <p>Áreas en DB: {areas.length}</p>
    </div>
  );
}

export default App;