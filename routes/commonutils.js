let isAdmin = (req) => {
  let context = req.session.context;
  if (context === undefined) {
    req.session.context = { isLoggedIn: false, privilege: null };
    context = req.session.context;
  }
  if (context.isLoggedIn && context.privilege === 'admin') {
    return true;
  } else {
    return false;
  }
};


let isManager = (req) => {
  let context = req.session.context;
  if (context === undefined) {
    req.session.context = { isLoggedIn: false, privilege: null };
    context = req.session.context;
  }
  if (context.isLoggedIn && context.privilege === 'manager') {
    return true;
  } else {
    return false;
  }
};

module.exports = { isAdmin, isManager };
