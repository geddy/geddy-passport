var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , user = require('./user')
  , config
  , successRedirect = geddy.config.passport.successRedirect
  , failureRedirect = geddy.config.passport.failureRedirect;

passport.use(new LocalStrategy(function(username, password, done) {
    //User.findOne({username: username, password: password}, function (err, user) {
    //  done(err, user);
    //});
    if (username == 'foo' && password == 'bar') {
      done(null, {foo: 'bar'});
    }
    else {
      done({msg: 'shit'}, null);
    }
}));

config = {
  callbackURL: geddy.config.fullHostname + '/auth/twitter/callback'
//, skipExtendedUserProfile: true // Want first and last name for creating User
};
config = geddy.mixin(config, geddy.config.passport.twitter);
passport.use(new TwitterStrategy(config,
    function(token, tokenSecret, profile, done) {
  done(null, profile);
}));

config = {
  callbackURL: geddy.config.fullHostname + '/auth/facebook/callback'
};
config = geddy.mixin(config, geddy.config.passport.facebook);
passport.use(new FacebookStrategy(config,
    function(accessToken, refreshToken, profile, done) {
   done(null, profile);
}));

var actions = new (function () {

  this.local = function (req, resp, params) {
    var self = this
      , handler = function (badCredsError, user, noCredsError) {
          console.log(arguments);
          if (badCredsError || noCredsError) {
            self.redirect(failureRedirect);
          }
          else {
            self.redirect(successRedirect);
          }
        };
    passport.authenticate('local', function () {
      handler.apply(null, arguments);
    })(req, resp, handler);
  };

  this.twitter = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('twitter')(req, resp);
  };

  this.twitterCallback = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('twitter', function (err, profile) {
      if (!profile) {
        self.redirect(failureRedirect);
      }
      else {
        try {
          user.lookupByPassport('twitter', profile, function (err, user) {
            self.session.set('userId', user.id);
            self.redirect(successRedirect);
          });
        }
        catch (e) {
          self.error(e);
        }
      }
    })(req, resp, function (e) {
      if (e) {
        self.error(e);
      }
    });
  };

  this.facebook = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      console.log(val);
      resp.redirect(val);
    };
    passport.authenticate('facebook')(req, resp);
  };

  this.facebookCallback = function (req, resp, params) {
    var self = this;
    req.session = this.session.data;
    // FIXME: hack until Passport defers to resp.redirect
    resp.end = function () {};
    resp.setHeader = function (headerName, val) {
      resp.redirect(val);
    };
    passport.authenticate('facebook', function (err, profile) {
      console.log(arguments);
      self.respond('ok', {format: 'txt'});
    })(req, resp);
  };

})();

module.exports = actions;
