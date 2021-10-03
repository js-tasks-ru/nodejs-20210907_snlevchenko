const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  
  const categories = await Category.find({});
  
  ctx.body = {
    categories: categories.map(u => ({
      id: u._id,
      title: u.title,
      subcategories: u.subcategories.map(s => ({
        id: s._id,
        title: s.title,
      }))
    })),
  };
  
};
