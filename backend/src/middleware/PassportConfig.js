const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = (passport) => {
    passport.use(new LocalStrategy());
};