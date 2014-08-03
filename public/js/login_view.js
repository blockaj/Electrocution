$(document).ready(function(){
  var registerDivHtml = "<div class='register'><h2>Register</h2><form name='registration' method='POST' action='/attempt_register'><input type='text' name='username' placeholder='username'><br/><input type='password' name='password' placeholder='password'><br/><input type='password' name='verify-password' placeholder='verify password'><br/><input type='submit' value='register'><p class='login'>OR LOGIN</p></form></div>";
  var loginDivHtml = "<div class='login'><h2>Login</h2><form name='login' method='POST' action='/attempt_login'><input name='username' type='text' placeholder='username'> <br><input name='password' type='password' placeholder='password'> <br><input type='submit' value='Login'><p class='register'>OR REGISTER</p></form></div>";
});
  $('p.register').click(function(){
    $(".login").replaceWith(registerDivHtml);
  });
  $("p.login").click(function(){
    $(".register").replaceWith(loginDivHtml);
});
