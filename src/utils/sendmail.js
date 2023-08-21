const nodemailer = require("nodemailer");
const config = require("../config/objectConfig");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmail_user_app,
    pass: config.gmail_pass_app,
  },
});

exports.sendMail = async (destino, asunto, html) => {
  return await transport.sendMail({
    from: "App test <gedesaurio@gmail.com>",
    // to: "gedesaurio@gmail.com",
    to: destino,
    // subject: "Mail de prueba",
    subject: asunto,
    // html: `<div>
    //         <h1>Esto es un mail test</h1>
    //       </div>`,
    html: html,
    attachments: [
      {
        filename: "ecommerceimg.jpg",
        path: __dirname + "/images/ecommerceimg.jpg",
        cid: "ecommerceimg",
      },
    ],
  });
};
