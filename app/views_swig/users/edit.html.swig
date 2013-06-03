<div class="hero-unit">
  <form id="user-form" class="form-horizontal" action="{{ userPath(params.id) }}?_method=PUT" method="POST">
    <fieldset>
      <legend>Update this User</legend>
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
      {% include formPath with user %}
      <div class="form-actions">
        <input type="submit" class="btn btn-primary" name="email" val="Save" />
        <input type="submit" class="btn btn-danger" value="Delete" formaction="{{ userPath(params.id) }}?_method=DELETE" />
      </div>
    </fieldset>
  </form>
</div>