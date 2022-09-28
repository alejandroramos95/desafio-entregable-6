const express = require("express");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Contenedor = require("./api/Contenedor");
const { Router } = require("express");
const routes = Router();

const app = express();
const PORT = 8080;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// Public statement
app.use(express.static("public"));

// Handlebars
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// Routes usage
app.use("/", routes);

const productos = new Contenedor();

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.get("/api/productos/listar", (req, res) => {
	res.json(productos.getAll());
});

routes.get("/api/productos/listar/:id", (req, res) => {
	let { id } = req.params;
	res.json(productos.getById(id));
});

routes.post("/api/productos/guardar", (req, res) => {
	let producto = req.body;
	productos.save(producto);
	res.redirect("/");
});

routes.put("/api/productos/actualizar/:id", (req, res) => {
	let { id } = req.params;
	let producto = req.body;
	productos.updateItem(producto, id);
	res.json(producto);
});

routes.delete("/api/productos/borrar/:id", (req, res) => {
	let { id } = req.params;
	let producto = productos.deleteById(id);
	res.json(producto);
});

routes.get("/", (req, res) => {
	let prods = productos.getAll();

	res.render("index", {
		layout: false,
		productos: prods,
		hayProductos: prods.length,
	});
});

// Connection with user

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado", socket.id);
});

// Server up

httpServer.listen(PORT, () => console.log("SERVER ON"));
