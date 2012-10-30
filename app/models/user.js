var User = function () {
  this.property('username', 'string');
  this.property('password', 'string');
  this.property('lastName', 'string');
  this.property('firstName', 'string');
  this.property('email', 'string');

  this.hasMany('Passports');
};

User = geddy.model.register('User', User);

