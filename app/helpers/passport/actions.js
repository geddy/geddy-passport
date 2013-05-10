var passport = require('passport')
  , user = require('./user')
  , config = geddy.config.passport
  , successRedirect = config.successRedirect
  , failureRedirect = config.failureRedirect
  , bcrypt = require('bcrypt')
  , cryptPass;

var SUPPORTED_SERVICES = [
      'twitter'
    , 'facebook'
    , 'yammer'
    ];

SUPPORTED_SERVICES.forEach(function (item) {
  var hostname = geddy.config.fullHostname || ''
    , config = {
        callbackURL: hostname + '/auth/' +
            item + '/callback'
      }
    , Strategy = require('passport-' + item).Strategy
    , handler = function(token, tokenSecret, profile, done) {
        // Pass along auth data so auth'd users can make
        // API calls to the third-party service
        var authData = {
          token: token
        };
        if (tokenSecret) {
          authData.tokenSecret = tokenSecret;
        }
        profile.authData = authData;
        done(null, profile);
      };

  geddy.mixin(config, geddy.config.passport[item]);
  passport.use(new Strategy(config, handler));
});

var actions = new (function () {
  var self = this;

  var _createInit = function (authType) {
        return function (req, resp, params) {
          var self = this;
          req.session = this.session.data;
          passport.authenticate(authType)(req, resp);
        };
      }

    , _createCallback = function (authType) {
        return function (req, resp, params) {
          var self = this
            , handler = function (err, profile) {
                if (!profile) {
                  self.redirect(failureRedirect);
                }
                else {
                  try {
                    user.lookupByPassport(authType, profile, function (err, user) {
                      if (err) {
                        self.error(err);
                      }
                      else {
                        // Local account's userId
                        self.session.set('userId', user.id);
                        // Third-party auth type, e.g. 'facebook'
                        self.session.set('authType', authType);
                        // Third-party auth tokens, may include 'token', 'tokenSecret'
                        self.session.set('authData', profile.authData);

                        self.redirect(successRedirect);
                      }
                    });
                  }
                  catch (e) {
                    self.error(e);
                  }
                }
              }
            , next = function (e) {
                if (e) {
                  self.error(e);
                }
              };
          req.session = this.session.data;
          passport.authenticate(authType, handler)(req, resp, next);
        };
      };

  this.local = function (req, resp, params) {
    var self = this
      , username = params.username
      , password = params.password;

    geddy.model.User.first({username: username}, {nocase: ['username']},
        function (err, user) {
      var crypted;
      if (err) {
        self.redirect(failureRedirect);
      }
      if (user) {
        if (!cryptPass) {
          cryptPass = require('./index').cryptPass;
        }

        if (bcrypt.compareSync(password, user.password)) {
          self.session.set('userId', user.id);
          self.session.set('authType', 'local');
          // No third-party auth tokens
          self.session.set('authData', {});

          self.redirect(successRedirect);
        }
        else {
          self.redirect(failureRedirect);
        }
      }
      else {
        self.redirect(failureRedirect);
      }
    });
  };

  SUPPORTED_SERVICES.forEach(function (item) {
    self[item] = _createInit(item);
    self[item + 'Callback'] = _createCallback(item);
  });

})();

module.exports = actions;
