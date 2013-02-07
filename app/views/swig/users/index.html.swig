{% extends layout %}
{% block content %}
<div class="hero-unit">
  <h2>All Users</h2>
  <p><a href="{{ addUserPath }}" class="btn pull-right">Create a new User</a></p>
</div>

{% if users %}
<% for (var i = 0, ii = users.length; i < ii; i++) { %>
{% for user in users %}
<div class="row list-item">
  <div class="span8">
    <h3><%- linkTo(users[i].id, userPath(users[i].id)); %></h3>
    <h3><a href="{% userPath(user.id) %}" class="btn pull-right">{{ user.id }}</a></h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{% user.id %}</h3>
  </div>
</div>
{% endfor %}
{% endif %}
{% endblock %}