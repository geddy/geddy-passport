{{{partial 'layout_header'}}}
  <body class="application">
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="i-bar"><i class="icon-chevron-down icon-white"></i></span>
          </a>
          <a class="brand" href="{{mainsPath}}">Geddy App</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active">{{{ linkTo 'Home' mainsPath }}}</li>
              <li>{{{ linkTo 'Tutorial' 'http://geddyjs.org/tutorial.html' }}}</li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
    <div class="container">
      {{{ yield }}}
    </div>
  </body>
{{{partial 'layout_footer'}}}
