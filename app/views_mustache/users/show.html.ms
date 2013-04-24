<div class="hero-unit">
  <h2>{{ params.id }}</h2>
  <a href="{{{ editUserPath params.id }}}" class="btn pull-right">Edit this user</a>
</div>

<h2>User Properties</h2>

<div class="row list-item">
  <div class="span8">
    <h3>id</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ params.id}}</h3>
  </div>
</div>

<div class="row list-item">
  <div class="span8">
    <h3>username</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ user.username}}</h3>
  </div>
</div>

<div class="row list-item">
  <div class="span8">
    <h3>password</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ user.password}}</h3>
  </div>
</div>

<div class="row list-item">
  <div class="span8">
    <h3>givenName</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ user.givenName}}</h3>
  </div>
</div>

<div class="row list-item">
  <div class="span8">
    <h3>familyName</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ user.familyName}}</h3>
  </div>
</div>

<div class="row list-item">
  <div class="span8">
    <h3>email</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ user.email}}</h3>
  </div>
</div>
