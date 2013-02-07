{% extends layout %}
{% block content %}
<div class="hero-unit">
  <form id="user-form" class="form-horizontal" action="<%= usersPath %>" method="POST">
    <fieldset>
      <legend>Create a new User</legend>
      {% if params.errors %}
      <div class="control-group">
        <ul>
        {% for err in params.errors %}
          <li>{{ err }}</li>
        {% endfor %}
        </ul>
      </div>
      {% endif %}
      {% include "_form.html.swig" %}
      <div class="form-actions">
        <input type="submit" class="btn btn-primary" name="email" val="Add" />
      </div>
    </fieldset>
  </form>
</div>
{% endblock %}