(function () {
  var SUPABASE_URL = 'https://dfywrmguseycngbyibfk.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_GMctEBefaTWILQol3nWBOw_ZjIZQ-EZ';

  var form = document.getElementById('contact-form');
  if (!form || !window.supabase) return;

  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  var note = document.getElementById('contact-form-note');
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      showNote('Please fill in your name, email and message.', true);
      return;
    }

    submitBtn.disabled = true;
    showNote('Sending…', false);

    supabase
      .from('enquiries')
      .insert({ name: name, email: email, message: message })
      .then(function (result) {
        if (result.error) throw result.error;
        form.reset();
        showNote('Thanks — your message has been sent. We\'ll get back to you soon.', false);
      })
      .catch(function () {
        showNote('Sorry, something went wrong. Please try again or call us on 0121 396 4720.', true);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });

  function showNote(text, isError) {
    if (!note) return;
    note.textContent = text;
    note.hidden = false;
    note.classList.toggle('is-error', !!isError);
  }
})();
