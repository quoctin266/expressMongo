import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import ejs from "ejs";
import { join } from "path";
import FileService from "../file/file.service";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  },
});

export const sendMail = async (
  template: string,
  context: any,
  recipient: string,
  subject: string
) => {
  let html = await ejs.renderFile(
    join(FileService.getRootPath(), `src/views/${template}`),
    context
  );

  const mailOptions = {
    from: process.env.SENDER_EMAIL as string,
    to: recipient,
    subject: subject,
    html: html as string, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else console.log("Email sent: ", info.response);
  });
};

export default transporter;
