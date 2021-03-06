const apiResponse = require('../helpers/apiResponse')
const db = require('../models')
const productSchema = require('../validation/productSchema')

const Product = db.products

// Create Product
const createProduct = async (req, res) => {
  try {
    let body = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
      userId: req.user.user_id
    }

    const validate = await productSchema.createProduct.validateAsync(body)

    const product = await Product.create(validate)
    res.status(200).send(apiResponse('success', 200, 'Produk Berhasil dibuat', product))
  } catch (err) {
    res.status(422).send(apiResponse('error', 422, err.message))
  }
}

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll({})
    res.status(200).send(apiResponse('success', 200, 'Produk berhasil didapatkan', products))
  } catch (err) {
    res.status(400).send(apiResponse('error', 400, err.message))
  }
}

// Get Product by ID
const getProductsById = async (req, res) => {
  try {
    let id = req.params.id
    let product = await Product.findOne({ where: {id: id} })
    res.status(200).send(apiResponse('success', 200, 'Berhasil medapatkan produk', product))
  } catch (err) {
    res.status(400).send(apiResponse('error', 400, err.message))
  }
}

// Get Published Product
const getPublishedProduct = async (req, res) => {
  try {
    let product = await Product.findAll({ where: { published: true }})
    res.status(200).send(apiResponse('success', 200, 'Berhasil mendapatkan produk', product))
  } catch (err) {
    res.status(400).send(apiResponse('error', 400, err.message))
  }
}

// Update Product
const updateProductById = async (req, res) => {
  try {
    let id = req.params.id
    const validate = await productSchema.updateProduct.validateAsync(req.body)
    const product = await Product.findOne({ where: { id: id } })
    if (product.userId !== req.user.user_id) throw new Error('Access Denied')
    await Product.update(validate, { where: {id: id} })
    res.status(200).send(apiResponse('success', 200, 'Berhasil merubah produk'))
  } catch (err) {
    res.status(433).send(apiResponse('error', 433, err.message))
  }
}

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id
    const product = await Product.findOne({ where: { id: id } })
    if (product.userId !== req.user.user_id) throw new Error('Access Denied')
    await Product.destroy({ where:{ id: id } })
    res.status(200).send(apiResponse('success', 200, 'Berhasil menghapus produk'))
  } catch (err) {
    res.status(433).send(apiResponse('error', 433, err.message))
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductsById,
  getPublishedProduct,
  updateProductById,
  deleteProduct
}
