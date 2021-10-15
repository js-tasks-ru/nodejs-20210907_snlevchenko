const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { displayName, email, password } = ctx.request.body;
  const verificationToken = uuid();

  const user = new User({email, displayName, verificationToken});
  await user.setPassword(password);
  await user.save();
  
  await sendMail({
    to: email,
    template: 'confirmation',
    locals: {
      token: verificationToken,
    },
  });
  
  ctx.body = {
    status: 'ok',
  };
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  
  if (!verificationToken) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  
  const user = await User.findOneAndUpdate({
    verificationToken
  }, {
    $unset: {
      verificationToken: 1,
    }
  });
  
  if (!user) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  
  const token = await ctx.login(user);
  
  ctx.status = 200;
  ctx.body = {
    token,
  };
};
