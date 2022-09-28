const express = require("express");
const Contenedor = require("../api/Contenedor");
const { Router } = require("express");
const routes = Router();

const productos = new Contenedor();

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.get("/productos/listar", (req, res) => {
	res.json(productos.getAll());
});

routes.get("/productos/listar/:id", (req, res) => {
	let { id } = req.params;
	res.json(productos.getById(id));
});

routes.post("/productos/guardar", (req, res) => {
	let producto = req.body;
	productos.save(producto);
	res.redirect("/");
});

routes.put("/productos/actualizar/:id", (req, res) => {
	let { id } = req.params;
	let producto = req.body;
	productos.updateItem(producto, id);
	res.json(producto);
});

routes.delete("/productos/borrar/:id", (req, res) => {
	let { id } = req.params;
	let producto = productos.deleteById(id);
	res.json(producto);
});

module.exports = routes;
