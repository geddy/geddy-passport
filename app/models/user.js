var User = function () {
  this.property('username', 'string');
  this.property('password', 'string');
  this.property('familyName', 'string');
  this.property('givenName', 'string');
  this.property('email', 'string');

  this.hasMany('Passports');
};

User = geddy.model.register('User', User);

