var nodemailer = require('nodemailer');
const fs = require('fs');
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'opt652@gmail.com',
    pass: 'Optimus@652',
  },
});

function sendOTP(email) {
  var mailOptions = {
    from: 'opt652@gmail.com',
    to: 'vinaysudrik@gmail.com',
    subject: 'BookMyTurf-Credential Details',
    text: '<h1></h1>',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendRegisterMail(email, username) {
  var mailTemplate = fs.readFileSync(__dirname + '/base.html', 'utf-8');

  var newValue = mailTemplate.replace(/{user-name}/g, username);

  fs.writeFileSync(__dirname + '/converted.html', newValue, 'utf-8');

  var htmlstream = fs.createReadStream(__dirname + '/converted.html');

  var mailOptions = {
    from: 'opt652@gmail.com',
    to: email,
    subject: 'BookMyTurf Registration Successful',
    html: htmlstream,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


let checkPrivilege = (req) => {
  let context = req.session.context;
  if (context === undefined || context === null) {
    req.session.context = {
      isLoggedIn: false,
      privilege: null,
      user_email: null,
      admin_data: null,
    };
    context = req.session.context;
  }
  if (context.isLoggedIn) {
    return true;
  } else {
    return false;
  }
};

module.exports = { checkPrivilege, sendRegisterMail };
