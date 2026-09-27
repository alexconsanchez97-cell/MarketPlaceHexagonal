require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { verificarToken, permitirRoles } = require("./interfaces/middlewares/auth");

const {
  registrarUsuario,
  iniciarSesion,
  listarPendientes,
  listarUsuarios,
  aprobarUsuario,
  eliminarUsuario,
} = require("./interfaces/userController");

const {
  crearProducto,
  listarCatalogo,
  listarTodosLosProductos,
  listarProductosPendientes,
  aprobarProducto,
  listarMisProductos,
  actualizarProducto,
  eliminarProducto,
} = require("./interfaces/productoController");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- AUTENTICACIÓN (públicas, sin token) ----------
app.post("/api/register", registrarUsuario);
app.post("/api/login", iniciarSesion);

// ---------- USUARIOS (solo admin) ----------
// verificarToken revisa el "gafete"; permitirRoles("admin") revisa que ese
// gafete diga rol=admin.
app.get("/api/usuarios/pendientes", verificarToken, permitirRoles("admin"), listarPendientes);
app.get("/api/usuarios", verificarToken, permitirRoles("admin"), listarUsuarios);
app.put("/api/usuarios/:id/aprobar", verificarToken, permitirRoles("admin"), aprobarUsuario);
app.delete("/api/usuarios/:id", verificarToken, permitirRoles("admin"), eliminarUsuario);

// ---------- PRODUCTOS ----------
// Catálogo público (solo aprobados): cualquiera con token
app.get("/api/productos", verificarToken, listarCatalogo);

// Solo admin: ver TODOS (incluye pendientes) y la lista de pendientes
app.get("/api/productos/todos", verificarToken, permitirRoles("admin"), listarTodosLosProductos);
app.get("/api/productos/pendientes", verificarToken, permitirRoles("admin"), listarProductosPendientes);
app.put("/api/productos/:id/aprobar", verificarToken, permitirRoles("admin"), aprobarProducto);

// "Mis productos" y crear: solo proveedor o admin
app.get("/api/productos/mios", verificarToken, permitirRoles("proveedor", "admin"), listarMisProductos);
app.post("/api/productos", verificarToken, permitirRoles("proveedor", "admin"), crearProducto);

// Editar/eliminar: proveedor o admin (la regla de "solo TUS productos" ya
// está adentro de productoService, aquí solo filtramos por rol)
app.put("/api/productos/:id", verificarToken, permitirRoles("proveedor", "admin"), actualizarProducto);
app.delete("/api/productos/:id", verificarToken, permitirRoles("proveedor", "admin"), eliminarProducto);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor Marketplace corriendo en el puerto ${process.env.PORT || 3000}`);
});