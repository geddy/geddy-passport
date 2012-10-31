var User = function () {

  this.property('username', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string', {required: true});
  this.property('firstName', 'string', {required: true});
  this.property('email', 'string', {required: true});

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');
};

User = geddy.model.register('User', User);

