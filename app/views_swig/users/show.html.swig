<div class="hero-unit">
  <h2>{{ user.id }}</h2>
  <p><a href="{{ editUserPath(params.id) }}" class="btn pull-right">Edit this user</a></p>
</div>

<h2>User Properties</h2>
{% for attr in user %}
{% if attr !== 'saved' %}
<div class="row list-item">
  <div class="span8">
    <h3>{{ attr }}</h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i>{{ attr }}</h3>
  </div>
</div>
{% endif %}
{% endfor %}