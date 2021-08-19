var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const fs = require('fs');
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
    auth: {
    user: 'contact.bookmyturf@gmail.com',
    pass: 'Vidal1337',
  },
}));

function sendOTP(email, otp) {
  var mailTemplate = fs.readFileSync(__dirname + '/index.html', 'utf-8');

  var newValue = mailTemplate.replace(/{user-otp}/g, otp);

  fs.writeFileSync(__dirname + '/converted.html', newValue, 'utf-8');

  var htmlstream = fs.createReadStream(__dirname + '/converted.html');

  var mailOptions = {
    from: 'contact.bookmyturf@gmail.com',
    to: email,
    subject: 'BookMyTurf-Credential Details',
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

function sendRegisterMail(email, username) {
  var mailTemplate = fs.readFileSync(__dirname + '/base.html', 'utf-8');

  var newValue = mailTemplate.replace(/{user-name}/g, username);

  fs.writeFileSync(__dirname + '/converted.html', newValue, 'utf-8');

  var htmlstream = fs.createReadStream(__dirname + '/converted.html');

  var mailOptions = {
    from: 'contact.bookmyturf@gmail.com',
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

module.exports = { checkPrivilege, sendRegisterMail, sendOTP };
