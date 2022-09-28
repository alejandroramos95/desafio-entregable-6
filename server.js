const express = require("express");
const handlebars = require("express-handlebars");
const Contenedor = require("./api/Contenedor");
const routes = require("./routes/productos");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const PORT = 8080;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let productos = new Contenedor();

app.use(express.static("public"));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use("/api", routes);

app.get("/", (req, res) => {
	let prods = productos.getAll();

	res.render("vista", {
		productos: prods,
		hayProductos: prods.length,
	});
});

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado", socket.id);
});

// Server levantado

httpServer.listen(PORT, () => console.log("SERVER ON"));
