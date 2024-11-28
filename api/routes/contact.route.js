const transporter = require("../config/emailConfig");

const processContactRequest = (req, res) => {
    const {
        email,
        firstName,
        lastName,
        phoneNumber,
        address,
        helpMessage,
    } = req.body;


    if (!email || !firstName || !lastName) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }
    let emailText = `
  Contact Requested Here are details:
  email: ${email}
  First Name: ${firstName}
  Last Name: ${lastName}
  Phone Number: ${phoneNumber}
  Address: ${address}
  
  Help Message: ${helpMessage}
  `;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "Contact Request",
        text: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Error sending email. Please try again." });
        }

        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Quote request submitted successfully" });
    });
};

module.exports = processContactRequest;
