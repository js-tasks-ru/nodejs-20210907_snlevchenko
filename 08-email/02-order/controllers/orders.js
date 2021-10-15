const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  
  const newOrder = await new Order({
    user: ctx.user._id,
    product,
    phone,
    address,
  }).save();
  
  await sendMail({
    to: ctx.user.email,
    template: 'order-confirmation',
    locals: {
      id: newOrder._id,
      product: newOrder.product,
    },
  });
  
  ctx.status = 200;
  ctx.body = {
    order: newOrder._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({
    user: ctx.user._id,
  }).populate('product');
  ctx.status = 200;
  ctx.body = {
    orders: orders.map(mapOrder),
  };
};
