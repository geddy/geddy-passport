var config = {
  connectCompatibility: true
, passport: {
    successRedirect: '/'
  , failureRedirect: '/login'
  , twitter: {
      consumerKey: 'NC41f9JtQwQ44Mk0EZKc2w'
    , consumerSecret: 'EW2xSsKo0NwInZhX1EKwzg1qkDY87IH6Ft57rhLWxU'
    }
  , facebook: {
      clientID: '133138720166664'
    , clientSecret: 'bf47b786507cc478b6554d9e73fd5de7'
    }
  }
};

config.secret = 'km1VvA4CO0HmE9rZquuQj0RWEn93UcxYDnkFmzGIRJcCv0apEcTiwJKh7HxRVAalxaFuxui8nV42WGujGZ2549ED6XtdSU6JRFGXwdnnAWcXph7W8WJ59cEzD2re3GMk';

module.exports = config;
