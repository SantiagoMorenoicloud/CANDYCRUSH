import * as producto from "../models/productos.model.js";

// Obtener todos los productos con info relacionada
export const getProductos = async (req, res, next) => {
  try {
    const productos = await producto.getAllProductos();
    res.json(productos);
  } catch (err) {
    next(err);
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res, next) => {
  try {
    const id = await producto.createProducto(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const productoData = await producto.getLibroById(id);
    if (!productoData) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json(productoData);
  } catch (error) {
    console.error("❌ Error en obtenerProductoPorId:", error);
    res.status(500).send("Error al buscar el producto");
  }
};

// Actualizar producto existente
export const updateProducto = async (req, res, next) => {
  try {
    const result = await producto.updateProducto(req.params.id, req.body);
    res.json({ updated: result });
  } catch (err) {
    next(err);
  }
};

// Eliminar producto
export const deleteProducto = async (req, res, next) => {
  try {
    const result = await producto.deleteProducto(req.params.id);
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};

// Obtener marcas para el formulario
export const getMarcas = async (req, res, next) => {
  try {
    const marcas = await producto.getMarcas();
    res.json(marcas);
  } catch (err) {
    next(err);
  }
};

// Obtener categorías para el formulario
export const getCategorias = async (req, res, next) => {
  try {
    const categorias = await producto.getCategorias();
    res.json(categorias);
  } catch (err) {
    next(err);
  }
};



