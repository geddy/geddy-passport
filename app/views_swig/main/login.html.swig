<!-- Lets talk about geddy -->
<link rel="stylesheet" href="/css/auth-buttons.css" rel="stylesheet" />
<div class="hero-unit">

  <p>
    <form id="login-form" class="form-horizontal" action="{{ localPath }}" method="POST">
    <fieldset>
      <legend>Log In</legend>
      <div class="control-group">
        <label for="username" class="control-label">username</label>
        <div class="controls">
          <input type="text" class="span6" name="username" val="{{ params.username }}" />
        </div>
      </div>
      <div class="control-group">
        <label for="password" class="control-label">password</label>
        <div class="controls">
          <input type="password" class="span6" name="password" val="{{ params.password }}" />
        </div>
      </div>
      <div class="form-actions">
        <input type="submit" class="btn btn-primary" val="Submit" />
      </div>
    </fieldset>
    </form>
  </p>

  <p style="text-align: center;">
    <a class="btn-auth btn-twitter large"
        href="{{ geddy.config.fullHostname }}{{ twitterPath }}">
      Log in with Twitter
    </a>
    &nbsp;
    <a class="btn-auth btn-facebook large"
        href="{{ geddy.config.fullHostname }}{{ facebookPath }}">
      Log in with Facebook
    </a>
  </p>
</div>