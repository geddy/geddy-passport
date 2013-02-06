<div class="hero-unit">
  <h2><%= user.id %></h2>
  <%- linkTo('Edit this user', editUserPath(params.id), {class: 'btn pull-right'}); %>
</div>

<h2>User Properties</h2>
<% for(var i in user) { -%>
<% if(i !== 'saved') { -%>
<div class="row list-item">
  <div class="span8">
    <h3><%= i %></h3>
  </div>
  <div class="span4">
    <h3><i class="icon-list-alt"></i><%= user[i] %></h3>
  </div>
</div>
<% } -%><% } -%>