import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "edrisabdella178@gmail.com",
    pass: "uyeetoqpcimvblxc",
  },
});

transporter.verify((error, success) => {
  if (error) console.error(error);
  else console.log("✅ Server is ready to take messages");
});
