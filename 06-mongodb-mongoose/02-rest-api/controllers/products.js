const mongoose = require('mongoose');
const Product = require('../models/Product');

const mappedProduct = (p) => ({
  id: p._id,
  title: p.title,
  description: p.description,
  price: p.price,
  category: p.category,
  subcategory: p.subcategory,
  images: p.images
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  
  const products = await Product.find({ subcategory });
  
  ctx.body = {
    products: products.map(p => mappedProduct(p)),
  };
  
};

module.exports.productList = async function productList(ctx, next) {
  
  const products = await Product.find({});
  
  ctx.body = {
    products: products.map(p => mappedProduct(p)),
  };
  
};

module.exports.productById = async function productById(ctx, next) {
  
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, '"' + ctx.params.id + '" - Invalid id');
  
  const product = await Product.findById(ctx.params.id);
  
  if (!product) ctx.throw(404, 'Product with id "' + ctx.params.id + '" Not found');
  
  ctx.body = { product: mappedProduct(product) };
  
};

