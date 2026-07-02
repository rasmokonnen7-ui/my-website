(function () {
  var supabase = window.supabaseClient;
  if (!supabase) return;

  function getDisplayName(user) {
    var profile = window.getProfileFromUser(user);
    return (profile && profile.fullName) || 'User';
  }

  function updateUI(session) {
    var loggedIn = !!session;
    var user = session && session.user;

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
    if (icon) {
      icon.hidden = false;

      if (loggedIn) {
        var name = getDisplayName(user);
        icon.href = 'settings.html';
        icon.title = 'Logged in as ' + name + ' — Settings';
        icon.setAttribute('aria-label', 'Account settings: ' + name);
        icon.classList.add('user-icon--logged-in');
        icon.classList.remove('user-icon--logged-out');
      } else {
        icon.href = 'login.html';
        icon.title = 'Log in';
        icon.setAttribute('aria-label', 'Log in');
        icon.classList.add('user-icon--logged-out');
        icon.classList.remove('user-icon--logged-in');
      }
    }

    document.dispatchEvent(new CustomEvent('brightminds:auth', {
      detail: { loggedIn: loggedIn, user: user }
    }));
  }

  supabase.auth.getSession().then(function (result) {
    updateUI(result.data.session);
  });

  supabase.auth.onAuthStateChange(function (event, session) {
    updateUI(session);
  });
})();
