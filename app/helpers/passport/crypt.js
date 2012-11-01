var crypto = require('crypto');

exports.cryptPass = function (cleartextPass) {
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }
  sha = crypto.createHash('sha1');
  sha.update(geddy.config.secret);
  sha.update(cleartextPass);
  return sha.digest('hex');
};


