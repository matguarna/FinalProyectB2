const config = require("../config/objectConfig");
const twilio = require("twilio");

const twilio_sid = config.twilio_sid;
const twilio_auth_token = config.twilio_auth_token;
const twilio_phone_number = config.twilio_phone_number;

//Genera la conexion con el perfil de la cuenta de twilio
const cliente = twilio(twilio_sid, twilio_auth_token);

exports.sendSms = () =>
  cliente.messages.create({
    body: "Soy un sms piola",
    from: twilio_phone_number,
    to: config.my_phone_number,
  });

exports.sendWhatsapp = () =>
  cliente.messages.create({
    body: "Soy el mejor wasap",
    from: "whatsapp:+14155238886",
    to: `whatsapp:${config.my_phone_number}`,
  });
