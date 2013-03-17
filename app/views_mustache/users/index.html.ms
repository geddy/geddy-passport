<div class="hero-unit">
  <h2>All Users</h2>
  {{{ linkTo 'Create a new User' addUserPath class='btn pull-right' }}}
</div>

{{#if users }}
  {{#each users}}
    <div class="row list-item">
      <div class="span8">
        <h3><a href="{{{ userPath id }}}">{{ id }}</a></h3>
      </div>
      <div class="span4">
        <h3><i class="icon-list-alt"></i>{{ id }}</h3>
      </div>
    </div>
  {{/each}}
{{/if}}
