import { useEffect, useState } from "react";
import {Area,getAreas} from './db.ts'; 
import './App.css';


function App() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState <boolean>(true);
  const [error, setError] = useState <string | null>(null);

  //
  const [nuevaArea, setNuevaArea] = useState({
    nombre: "",
    color: "",
    avatar_tipo: "",
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const result = await getAreas();
        setAreas(result);
        
      } catch (e:unknown) {
        if(e instanceof Error){ //type guard, vereficamos que lo que nos boto si es un error
          setError(e.message);
        }
        else{
          setError("Error desconocido");
        }
      }finally {
        setLoading(false);//pases lo q pase debe acabar de cargar
      }
      
    }
    cargarDatos();
  }, []);

  return (
  <div>
    {loading && <p>Cargando áreas...</p>}
    
    {error && <p>Error: {error}</p>}
    
    {!loading && !error && (
      <div>
        <p>Áreas en DB: {areas.length}</p>
        <ul>
          {areas.map((area) => (
            <li key={area.id}>{area.nombre}</li>
          ))}
        </ul>
      </div>
    )}
    <input
      type="text"
      value={nuevaArea.nombre}
      onChange={(e) => setNuevaArea({ ...nuevaArea, nombre: e.target.value })}
    />
    <input
      type="color"
      value={nuevaArea.color}
      onChange={(e) => setNuevaArea({ ...nuevaArea, color: e.target.value })}
    />
  </div>
);
}

export default App;

