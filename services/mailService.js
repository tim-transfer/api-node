import nodemailer from "nodemailer";
import config from "../config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.mail.address,
    pass: config.mail.pass,
  },
});

const sendSignUpMail = async (mail, url) => {
  const send = await transporter.sendMail({
    to: mail,
    subject: "TimTransfer - Créez votre compte",
    html: `<p>Bonjour,</p>
      <p>Veuillez créer votre compte via <a href="${url}">ce lien</a>.</p>
      <p>L'équipe DataTim</p>`,
  });
  return send;
};

const sendMailToFirstConnection = async (addressToSend, password) => {
  const info = await transporter.sendMail({
    from: '"TimeTransfer"timeTransfer53@gmail.com',
    to: addressToSend,
    subject: "Nouveau identifiant de connexion",
    html:
      "<h2>Bonjour, voici vos nouveaux identifiants de connexion : </h2>" +
      "<p>adresse mail pour se connecter : " +
      addressToSend +
      "</p>" +
      "<p>Mot de passe temporaire : " +
      password +
      "</p>",
  });
};

export default {
  sendSignUpMail,
  sendMailToFirstConnection,
};
