var crypto = require('crypto');

exports.actions = require('./actions');

exports.requireAuth = function () {
  if (!this.session.get('userId')) {
    this.redirect('/login');
  }
};

exports.cryptPass = function (cleartextPass) {
  var sha;
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }
  sha = crypto.createHash('sha1');
  sha.update(geddy.config.secret);
  sha.update(cleartextPass);
  return sha.digest('hex');
};



