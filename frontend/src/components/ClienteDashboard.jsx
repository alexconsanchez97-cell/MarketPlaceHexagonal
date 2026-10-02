import { useEffect, useState } from "react";
import apiFetch from "../api";

function ClienteDashboard() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // /productos (sin /mios) trae el catálogo COMPLETO, de todos los proveedores.
    apiFetch("/productos")
      .then((datos) => setProductos(datos))
      .catch((error) => alert(error.message));
  }, []);

  return (
    <div>
      <h2>Catálogo de productos</h2>

      {/* Nota: aquí NO hay columna de "Acciones" ni botones de editar/eliminar
          a propósito -- el rol cliente solo puede consultar. */}
      <table border="1">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>
                {/* Si el proveedor no puso URL de imagen, mostramos un texto
                    en vez de un <img> roto */}
                {p.imagenUrl ? (
                  <img src={p.imagenUrl} alt={p.nombre} width="80" />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteDashboard;