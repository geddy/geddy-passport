<div class="hero-unit">
  <form id="user-form" class="form-horizontal" action="{{{ userPath params.id }}}?_method=PUT" method="POST">
    <fieldset>
      <legend>Update this User</legend>
      {{#if params.errors }}
        <div class="control-group">
          <ul>
            {{#each params.errors}}
              <li>{{ this }}</li>
            {{/each}}
          </ul>
        </div>
      {{/if}}
      {{{ partial 'form' user=user }}}
      <div class="form-actions">
        {{{ contentTag 'input' 'Save' type='submit' class='btn btn-primary' }}}
        <button type="submit" formaction="{{{ userPath params.id }}}?_method=DELETE" formmethod='POST' class='btn btn-danger'>Remove</button>
      </div>
    </fieldset>
  </form>
</div>
