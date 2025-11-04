/**
 * ✅ testMailSend.js
 * Gmail SMTP tester for Real-Time Chat Pro
 * Sends a sample email to confirm that Gmail SMTP works.
 * Author: Edris Abdella
 */

import nodemailer from "nodemailer";

// Replace these with your actual Gmail and app password
const EMAIL_USER = "edrisabdella178@gmail.com";
const EMAIL_PASS = "uyeetoqpcimvblxc"; // Use Gmail App Password (not your Gmail login)

async function sendTestEmail() {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Verify the connection
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails.");

    // Send a test message
    const info = await transporter.sendMail({
      from: `"Real-Time Chat Pro" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Sends to your own inbox
      subject: "SMTP Test - Real-Time Chat Pro",
      text: "Hello Edris! 👋\nThis is a test email from your Real-Time Chat Pro app.\nYour Gmail SMTP configuration is working perfectly!",
      html: `<h2>Hello Edris 👋</h2>
             <p>This is a test email from your <b>Real-Time Chat Pro</b> application.</p>
             <p>✅ Your Gmail SMTP setup is working correctly!</p>
             <p><small>Sent at: ${new Date().toLocaleString()}</small></p>`,
    });

    console.log("📩 Test email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send test email:");
    console.error(error);
  }
}

// Run test
sendTestEmail();
