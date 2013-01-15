var crypto = require('crypto')
  , bcrypt = require('bcrypt');

exports.actions = require('./actions');

exports.requireAuth = function () {
  if (!this.session.get('userId')) {
    this.redirect('/login');
  }
};

exports.cryptPass = function (cleartextPass) {
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }

  return bcrypt.hashSync(cleartextPass, 10);
};



