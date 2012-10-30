var User = geddy.model.User
  , Passport = geddy.model.Passport;

  var _authTypes = {
        twitter: {
          keyField: 'id'
        , parseProfile: function (profile) {
            var userData = {}
              , displayName = profile.displayName
              , names;
            if (displayName) {
              names = displayName.split(/\S/);
              userData.firstName = names[0];
              if (names[1]) {
                userData.lastName = names[1];
              }
            }
            return userData;
          }
        }
      , facebook: {
          keyField: 'id'
        , parseProfile: function (profile) {
            var userData = {
              firstName: profile.first_name
            , lastName: profile.last_name
            };
            return userData;
          }
        }
      }
    , _findOrCreateUser = function (passport, profile, callback) {
        passport.getUser(function (err, data) {
          var user
            , userData;

          if (err) {
            callback(err, null);
          }
          else {
            if (!data) {
              userData = _authTypes[passport.authType].parseProfile(profile);
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
    var typeData = _authTypes[authType]
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
