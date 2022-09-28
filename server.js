const fs = require("fs");
const moment = require("moment");
const express = require("express");
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

app.get("/:file", (req, res) => {
  res.sendFile(__dirname + `/public/${req.params.file}`);
});

// Server up

httpServer.listen(PORT, () => console.log("SERVER ON"));

const messages = [];

io.on("connection", (socket) => {
  console.log("Se conectó un nuevo usuario", socket.id);
 
  io.sockets.emit("lista-productos", productos.getAll());

  socket.emit("messages", messages);

  socket.on(
    "new-message",
    (data) => {
      data.date = moment().format("DD-MM-YYYY HH:mm:ss");
      messages.push(data);
      io.sockets.emit("messages", messages);
    },
    () => {
      fs.writeFileSync("message_history.json", JSON.stringify(messages));
    }
  );
});
