(function () {
  var SUPABASE_URL = 'https://dfywrmguseycngbyibfk.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_GMctEBefaTWILQol3nWBOw_ZjIZQ-EZ';

  if (!window.supabase) return;

  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  window.getProfileFromUser = function (user) {
    if (!user) return null;
    var meta = user.user_metadata || {};
    return {
      fullName: meta.full_name || '',
      email: user.email || '',
      phone: meta.phone || '',
      accountType: meta.account_type || 'Parent / guardian'
    };
  };
})();
