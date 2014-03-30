var passport = require('../../lib/passport');

var Auth = function () {
  geddy.mixin(this, passport.actions);
};

exports.Auth = Auth;
