const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { displayName, email, password } = ctx.request.body;
  const verificationToken = uuid();
  /*
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      }
    };
    return;
  }
   */
  const user = new User({email, displayName, verificationToken});
  await user.setPassword(password);

  try {
    await user.save();
  } catch (e) {
    throw e;
  }
  
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
