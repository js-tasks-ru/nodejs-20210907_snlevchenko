const User = require('../../models/User');

module.exports = async (strategy, email, displayName, done) => {
  if(!email) return done(null, false, 'Не указан email');
  await User.findOne({ email }, async (err, user) => {
    if (err) return done(err);
    
    if(!user) {
      try {
        user = new User({
          email,
          displayName: displayName ? displayName : email.split('@')[0],
        });
        await user.save();
      } catch(err) {
        return done(err);
      }
    }
    
    return done(null, user);
  });
};
