(function () {
  var loggedIn = localStorage.getItem('brightMindsLoggedIn') === 'true';

  if (loggedIn && /signup\.html$/i.test(window.location.pathname)) {
    window.location.replace('settings.html');
    return;
  }

  if (loggedIn && /login\.html$/i.test(window.location.pathname)) {
    window.location.replace('settings.html');
    return;
  }

  if (loggedIn) {
    document.querySelectorAll('a[href="signup.html"]').forEach(function (link) {
      link.href = 'settings.html';
      if (link.classList.contains('menu-signup') || link.classList.contains('btn-primary')) {
        link.textContent = 'Settings';
      } else if (link.textContent.trim() === 'Sign up') {
        link.textContent = 'Settings';
      }
    });

    document.querySelectorAll('a[href="login.html"]').forEach(function (link) {
      link.style.display = 'none';
    });
  }

  var icon = document.getElementById('user-icon');
  if (!icon) return;

  icon.hidden = false;

  if (loggedIn) {
    try {
      var user = JSON.parse(localStorage.getItem('brightMindsUser') || '{}');
      var name = user.fullName || 'User';
      icon.href = 'settings.html';
      icon.title = 'Logged in as ' + name + ' — Settings';
      icon.setAttribute('aria-label', 'Account settings: ' + name);
      icon.classList.add('user-icon--logged-in');
      icon.classList.remove('user-icon--logged-out');
    } catch (err) {
      icon.href = 'settings.html';
      icon.title = 'Account settings';
      icon.setAttribute('aria-label', 'Account settings');
    }
  } else {
    icon.href = 'login.html';
    icon.title = 'Log in';
    icon.setAttribute('aria-label', 'Log in');
    icon.classList.add('user-icon--logged-out');
    icon.classList.remove('user-icon--logged-in');
  }
})();
