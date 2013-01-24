var crypto = require('crypto');

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
  var sha;
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }
  sha = crypto.createHash('sha1');
  sha.update(geddy.config.secret);
  sha.update(cleartextPass);
  return sha.digest('hex');
};



