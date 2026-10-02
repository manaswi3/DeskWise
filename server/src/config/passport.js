import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const DUMMY_HASH = bcrypt.hashSync('timing-equaliser', 12);

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        await bcrypt.compare(password, DUMMY_HASH);
        return done(null, false);
      }
      const valid = await user.comparePassword(password);
      return done(null, valid ? user : false);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

export default passport;
