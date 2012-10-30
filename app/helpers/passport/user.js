var strategies = require('./strategies')
  , User = geddy.model.User
  , Passport = geddy.model.Passport
  , user
  , _findOrCreateUser;

_findOrCreateUser = function (passport, profile, callback) {
  passport.getUser(function (err, data) {
    var user
      , userData;

    if (err) {
      callback(err, null);
    }
    else {
      if (!data) {
        userData = strategies[passport.authType].parseProfile(profile);
        user = User.create(userData);
        user.save(function (err, data) {
          if (err) {
            callback(err, null);
          }
          else {
            user.addPassport(passport);
            user.save(function (err, data) {
              if (err) {
                callback(err, null);
              }
              else {
                callback(null, user);
              }
            });
          }
        });
      }
      else {
        user = data;
        callback(null, user);
      }
    }
  });
};

user = new (function () {

  this.lookupByPassport = function (authType, profile, callback) {
    var typeData = strategies[authType]
      , key = profile[typeData.keyField]
      , passport;

    passport = Passport.first({authType: authType, key: key}, function (err, data) {
      var pass;
      if (err) {
        callback(err, null);
      }
      else {
        if (!data) {
          pass = Passport.create({
            authType: authType
          , key: key
          });
          pass.save(function (err, data) {
            if (err) {
              callback(err, null);
            }
            else {
              _findOrCreateUser(pass, profile, callback);
            }
          });
        }
        else {
          pass = data;
          _findOrCreateUser(pass, profile, callback);
        }
      }
    });
  };

})();

module.exports = user;
