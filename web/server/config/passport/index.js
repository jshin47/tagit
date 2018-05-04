import mongoose from 'mongoose';

import local from './local';

const User = mongoose.model('User');

export default function(passport) {
  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));
  passport.use(local);
}
