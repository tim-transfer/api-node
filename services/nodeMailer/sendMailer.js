import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "timeTransfer53@gmail.com",
    pass: "brhg llyn npoc xtmb",
  },
});

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

export default sendMailToFirstConnection;
