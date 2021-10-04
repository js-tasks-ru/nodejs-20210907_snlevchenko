const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async (username, password, done) => {
      await User.findOne({ email: username }, async (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, 'Нет такого пользователя');
        
        const isValidPwd = await user.checkPassword(password);

        if (!isValidPwd) return done(null, false, 'Неверный пароль');
        
        return done(null, user);
      });
    },
);
