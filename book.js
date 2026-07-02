(function () {
  var form = document.getElementById('booking-form');
  var supabase = window.supabaseClient;
  if (!form || !supabase) return;

  var note = document.getElementById('booking-form-note');
  var submitBtn = form.querySelector('button[type="submit"]');
  var subjectInputs = form.querySelectorAll('input[name="Subjects"]');
  var sessionInputs = form.querySelectorAll('input[name="Sessions"]');
  var loggedInBanner = document.getElementById('logged-in-banner');
  var introText = document.getElementById('book-intro-text');

  function fillFromUser(user) {
    var profile = window.getProfileFromUser(user);
    if (!profile || !profile.fullName) return;

    loggedInBanner.hidden = false;
    loggedInBanner.textContent = 'Welcome back, ' + profile.fullName + '! You\'re logged in — complete your booking below.';
    introText.textContent = 'Your details have been filled in from your account. Choose your subjects and times below.';

    if (profile.accountType === 'Student') {
      document.getElementById('student-name').value = profile.fullName;
    } else {
      document.getElementById('parent-name').value = profile.fullName;
    }
    if (profile.email) document.getElementById('email').value = profile.email;
    if (profile.phone) document.getElementById('phone').value = profile.phone;
  }

  document.addEventListener('brightminds:auth', function (e) {
    if (e.detail.loggedIn && e.detail.user) {
      fillFromUser(e.detail.user);
    }
  });

  function updateSessions() {
    var selected = {};
    subjectInputs.forEach(function (input) {
      selected[input.dataset.subject] = input.checked;
    });

    sessionInputs.forEach(function (input) {
      var subject = input.dataset.subject;
      var enabled = !!selected[subject];
      input.disabled = !enabled;
      if (!enabled) input.checked = false;
    });

    form.querySelectorAll('.session-group').forEach(function (group) {
      var subject = group.dataset.subject;
      group.classList.toggle('disabled', !selected[subject]);
    });
  }

  subjectInputs.forEach(function (input) {
    input.addEventListener('change', updateSessions);
  });

  sessionInputs.forEach(function (input) {
    input.addEventListener('click', function (e) {
      if (input.disabled) e.preventDefault();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var subjects = Array.from(form.querySelectorAll('input[name="Subjects"]:checked')).map(function (el) {
      return el.value;
    });
    var sessions = Array.from(form.querySelectorAll('input[name="Sessions"]:checked')).map(function (el) {
      return el.value;
    });

    if (!subjects.length) {
      showNote('Please select at least one subject.', true);
      return;
    }
    if (!sessions.length) {
      showNote('Please select at least one session time for your chosen subject(s).', true);
      return;
    }

    var parentName = document.getElementById('parent-name').value.trim();
    var studentName = document.getElementById('student-name').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var yearGroup = document.getElementById('year-group').value;
    var notes = document.getElementById('notes').value.trim();

    submitBtn.disabled = true;
    showNote('Sending your booking request…', false);

    supabase.auth.getSession().then(function (sessionResult) {
      var userId = sessionResult.data.session ? sessionResult.data.session.user.id : null;
      var row = {
        parent_name: parentName,
        student_name: studentName,
        email: email,
        phone: phone,
        year_group: yearGroup,
        subjects: subjects,
        sessions: sessions,
        notes: notes || null
      };

      if (userId) row.user_id = userId;

      return supabase.from('bookings').insert(row);
    }).then(function (result) {
      if (result.error) throw result.error;
      form.reset();
      updateSessions();
      showNote('Thanks — your booking request has been sent. We\'ll confirm your place within one working day.', false);
    }).catch(function () {
      showNote('Sorry, something went wrong. Please try again or call us on 0121 396 4720.', true);
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });

  function showNote(text, isError) {
    if (!note) return;
    note.textContent = text;
    note.hidden = false;
    note.classList.toggle('is-error', !!isError);
  }

  updateSessions();
})();
