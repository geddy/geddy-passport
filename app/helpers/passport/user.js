var User = geddy.model.User
  , Passport = geddy.model.Passport;

  var _authTypes = {
        twitter: {
          keyField: 'id'
        }
      }
    , _findOrCreateUser = function (passport, callback) {
        console.log(passport);
        callback();
      };

user = new (function () {

  this.lookupByPassport = function (authType, profile, callback) {
    var typeData = _authTypes[authType]
      , key = profile[typeData.keyField]
      , passport;

    passport = Passport.first({authType: authType, key: key}, function (err, data) {
      var pass;
      if (err) {
        console.dir(err);
        return callback(err, null);
      }
      else {
        if (!data) {
          pass = Passport.create({
            authType: authType
          , key: key
          });
          pass.save(function (err, data) {
            if (err) {
              console.dir(err);
              return callback(err, null);
            }
            else {
              _findOrCreateUser(pass, callback);
            }
          });
        }
        else {
          pass = data;
          _findOrCreateUser(pass, callback);
        }
      }
      callback();
    });
  };

})();

module.exports = user;
