import { useEffect, useState } from "react";
import {Area,getAreas, createArea, deleteArea, updateArea} from './db.ts'; 
import './App.css';

function App() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState <boolean>(true);
  const [error, setError] = useState <string | null>(null);
  const [editandoNombreId, setEditandoNombreId] = useState <number|null>(null);
  const [editandoColorId, setEditandoColorId] = useState <number|null>(null);
  const [nombreEditado, setNombreEditado] = useState<string>("");
  const [colorEditando, setColorEditando] = useState<string>("");

  //vistas
  type Vista = 'inicio' | 'area';
  const [vista, setVista] = useState <Vista> ('inicio');
  const [areaIdSeleccionada, setAreaIdSeleccionada] = useState <number | null>(null);
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
  // funcion handle para crear una nueva area
  async function handleCrearArea(nombre: string, color: string, avatar_tipo: string){
      try {
        await createArea(nombre, color, avatar_tipo);
        const result = await getAreas();//refetch despues de mutacion
        setAreas(result);
        setNuevaArea({nombre: "", color: "", avatar_tipo: ""});//limpiamos input
      } catch (e) {
        if(e instanceof Error){ //type guard, vereficamos que lo que nos boto si es un error
          setError(e.message);
        }
        else{
          setError("Error desconocido");
        }
      }
  }
  //handle borrar area
  async function handleBorrarArea(id: number){
      try {
        await deleteArea(id);
        const result = await getAreas();//refetch despues de mutacion
        setAreas(result);
        
      } catch (e) {
        if(e instanceof Error){ //type guard, vereficamos que lo que nos boto si es un error
          setError(e.message);
        }
        else{
          setError("Error desconocido");
        }
      }
  }
  //handle actualizar
  async function handleActualizarArea(id: number, nombre: string, color: string){
    try {
        
        await updateArea(id, nombre, color);
        const result = await getAreas();
        setAreas(result);
        
      } catch (e) {
        if(e instanceof Error){ //type guard, vereficamos que lo que nos boto si es un error
          setError(e.message);
        }
        else{
          setError("Error desconocido");
        }
      }
  }
  function renderizarVista() {
  switch (vista) {
    case 'inicio':
      return (
      <div>
        {loading && <p>Cargando áreas...</p>}
        
        {error && <p>Error: {error}</p>}
        
        {!loading && !error && (
          <div>
            <p>Áreas en DB: {areas.length}</p>
            <ul>
              {areas.map((area) => (
                <li key={area.id}>
                {area.id === editandoNombreId ? (
                  <>
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                    />
                    <button onClick={() => {
                      handleActualizarArea(area.id, nombreEditado, area.color);
                      setEditandoNombreId(null);
                    }}>
                      guardar
                    </button>
                  </>
                ) : (
                  <>
                    {area.nombre}
                    <button onClick={() => {
                      setEditandoNombreId(area.id);
                      setNombreEditado(area.nombre);
                    }}>
                      editar
                    </button>
                  </>
                )}
                {
                  area.id == editandoColorId ? (
                    <>
                    <input
                      type="color"
                      value={colorEditando}
                      onChange={(e) => setColorEditando(e.target.value)}
                    />
                    <button onClick={() => {
                      handleActualizarArea(area.id, area.nombre, colorEditando);
                      setEditandoColorId(null);
                    }}>
                      guardar
                    </button>
                  </>
                  ) : (
                    <>
                    <button onClick={() => {
                      setEditandoColorId(area.id);
                      setColorEditando(area.color);
                    }}>
                      editar color
                    </button>
                  </>
                  )
                }
                <button onClick={() =>{ // seleccionar area temporal 
                  setAreaIdSeleccionada(area.id);
                  setVista('area');
                }}>
                  seleccionar
                </button>

                <button onClick={() => handleBorrarArea(area.id)}>
                  borrar
                </button>
              </li>
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
        <input
          type="text"
          value={nuevaArea.avatar_tipo}
          onChange={(e) => setNuevaArea({ ...nuevaArea, avatar_tipo: e.target.value })}
        />
        <button onClick={()=>handleCrearArea(nuevaArea.nombre, nuevaArea.color, nuevaArea.avatar_tipo)}>
          crear area
        </button>
      </div>
    );
    case 'area':
      return (
        <div>
          <p>Vista de detalle del área {areaIdSeleccionada}</p>
          <button onClick={() => setVista('inicio')}>volver</button>
        </div>
      );
    default:
      return null;
  }
}

return (
  <div>
    {renderizarVista()}
  </div>
);
}

export default App;

