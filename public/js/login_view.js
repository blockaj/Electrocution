$(document).ready(function(){
  var registerDivHtml = "";
  var loginDivHtml = "<div class='login'><h2>Login</h2><form name='login' method='POST' action='/attempt_login'><input name='username' type='text' placeholder='username'> <br><input name='password' type='password' placeholder='password'> <br><input type='submit' value='Login'><p class='register'>OR REGISTER</p></form></div>";
});
  $('p.register').click(function(){
    $(".login").replaceWith(registerDivHtml);
  });
  $("p.login").click(function(){
    $(".register").replaceWith(loginDivHtml);
});
