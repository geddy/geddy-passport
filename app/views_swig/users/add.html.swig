<div class="hero-unit">
  <form id="user-form" class="form-horizontal" action="{{ usersPath }}" method="POST">
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
      {% set formPath = [process.cwd(), 'app/views/users/_form.html.swig'] %}
      {% set formPath = formPath|join('/') %}
      {% include formPath %}
      <div class="form-actions">
        <input type="submit" class="btn btn-primary" name="email" val="Add" />
      </div>
    </fieldset>
  </form>
</div>