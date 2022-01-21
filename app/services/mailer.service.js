let nodemailer = require('nodemailer');
let aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");
const templateService = require('../services/template.service');

const ses = new aws.SES({
  apiVersion: "2012-10-17",
  region: "us-east-1",
  defaultProvider,
});

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.PTP_EMAIL,
//         pass: process.env.PTP_EMAIL_PASSWORD
//     }
// });

async function sendDM(user, mailType) {

    try {
        console.log('Calling Mailer service with payload ', JSON.stringify(user));

        const opts = templateService.getEmailOpts(user, mailType);
        console.log('email opts ', JSON.stringify(opts));
        const data = await transporter.sendMail(opts);

        return { success : true, message : 'Email sent.', data : data }
    }
    catch (err) {
        console.log(err);
        return { success : false, message : 'Email service not working.' , error : err}
    }
}

exports.sendDM = sendDM;
