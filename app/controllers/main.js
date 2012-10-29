/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy(function(username, password, done) {
    //User.findOne({ username: username, password: password }, function (err, user) {
    //  done(err, user);
    //});
    if (username == 'foo' && password == 'bar') {
      done(null, {foo: 'bar'});
    }
    else {
      done({msg: 'shit'}, null);
    }
}));


passport.use(new TwitterStrategy({
consumerKey: 'NC41f9JtQwQ44Mk0EZKc2w'
, consumerSecret: 'EW2xSsKo0NwInZhX1EKwzg1qkDY87IH6Ft57rhLWxU'
, callbackURL: "http://localhost:4000/auth/twitter/callback"
, skipExtendedUserProfile: true
}, function(token, tokenSecret, profile, done) {
    done(null, profile);
}));

passport.use(new FacebookStrategy({
  clientID: '133138720166664'
, clientSecret: 'bf47b786507cc478b6554d9e73fd5de7'
, callbackURL: "http://localhost:4000/auth/facebook/callback"
}
, function(accessToken, refreshToken, profile, done) {
    done(null, profile);
}));

var Main = function () {
  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };

  this.local = function (req, resp, params) {
    var self = this
      , handler = function (badCredsError, user, noCredsError) {
          console.log(arguments);
          if (badCredsError || noCredsError) {
            self.redirect('/bad_login');
          }
          else {
            self.respond('ok', {format: 'txt'});
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
      console.log(arguments);
      self.respond('ok', {format: 'txt'});
    })(req, resp);
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

};

exports.Main = Main;


