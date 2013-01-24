var crypto = require('crypto')
  , bcrypt = require('bcrypt');

exports.actions = require('./actions');

// Redirect to the login page unless the user has an authenticated session.
// Leaves open the index, login, logout (on Main), and (of course) the actual
// authentication endpoints
exports.requireAuth = function () {
  if (!(this.session.get('userId') ||
      this.name == 'Main' ||
      this.name == 'Auth')) {
    this.redirect('/login');
  }
};

exports.cryptPass = function (cleartextPass) {
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }

  return bcrypt.hashSync(cleartextPass, 10);
};



