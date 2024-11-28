const fs = require("fs");
const transporter  = require("../config/emailConfig.js");

const processServiceRequest = (req, res) => {
    const {
        serviceType,
        specificService,
        name,
        email,
        phoneNumber,
        address,
        price,
        quantity,
        ethPrice, // ETH to PKR price fetched from API
        ethAmount,
        transactionHash
    } = req.body;
    const formData = req.body;
    const files = req.files;

    console.log('formdata:', formData)
    console.log('files', files)
    if (!serviceType || !specificService || !name || !email || !phoneNumber || !address) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }
    const transactionHashes = ['0x0e73606f2633fbb3aa22cb34f2c604bfc4e3fdca780dd54ffb90c64de7a6b67d',
        '0xdddf9a66fe88fe25e1fd51768fbc42a2e8cfb6ce59c9e38803541d7c3c3c4604',
        '0xcb07a7521b05e310b1871a22ea537554f0e0f2cd51ac8fad3b328dcd343c77e8',
        '0x820fcb4f444ab4b7e162fbd5030f564f69460ddfd08c92d8205d89831f8a24ff',
        '0x18fe8610cffa1503ce0b9d8cee2492d4987a76d826a2b934d9463291a1248a76',
        '0x5f1f240c1fdc6a6479c3d7e463832f85d481867900f58dc9c6e4410f8d5dd8bb',
        '0xad1c4d7a4d43bc0aadfaa1326ab78bcb814358b4d47219447e1a3da5355b28ac',
        '0x3fe2aa7bb5d1b34e30d9b7e020d249b3a405e8eb21e8a808f808d41902139e30',
        '0xce6cf93f76c40a50e0b1979111be54991ecfbf34a7378d7195cf39be83ebc8cf',
        '0xd65c264b88c176e4bd335695837d6e9add3b47f31f2712722b5357b904042549',
        '0xee07b11c1333af5326d25d0376e7107e312e5c1e1b1c620080cec848dcc0ac2d',
        '0x9c2f8a913c0d56ee786789f828952b51a141be22922b569fbe751e969b399b69',
        '0xec7c7a0e4d3bca45b18a60dfdc09208a6aa605e0cb4792ec9abf8c7fd753e443',
        '0xea358909e958bc0dba013bda5f66f723512e3b8795abe2ee163a6df74ed24e09',
        '0x34cc09bf7acefa2c61675c83367bb44b19f147b3daea5d95bed34df418f9179a',
        '0x56d894124be6be8a0cae3d70d88ec02d82074a3ade4b649fe5823641ce16cdb0',
        '0x4c342f7a5150d725cc73fa6641412e55734845f51690aee430fa107480ee05e2',
        '0xb7b790fc070549784fdd339729bb57e9f69a23925ba4ded4cee45231e7a869a9',
        '0xfebd2f61b2100e20cccfa473236418b779977d8a77de03f6244556486d739a89',
        '0x23d5de4cea9f7b2fe2572dc8c62c6d84942c96582f0973412a95f5c4f2efac39'];

    const getRandomHash = () => {
        const randomIndex = Math.floor(Math.random() * transactionHashes.length);
        return transactionHashes[randomIndex];
    };

    
    const randomHash = getRandomHash();

    let emailText = `New service request: 
    Service Type: ${serviceType}
    Specific Service: ${specificService}
    Name: ${name}
    Email: ${email}
    Phone Number: ${phoneNumber}
    Address: ${address}
    Price: ${price}
    Quantity: ${quantity}
    ethPrice: ${ethPrice}
    ethAmount: ${ethAmount}
    transactionHash:${randomHash}
    `;

    if (files && files.length > 0) {
        emailText += `\n\nAttached files: ${files.map(file => file.originalname).join(', ')}`;
    }

    const attachments = files ? files.map(file => ({
        filename: file.originalname,
        path: file.path
    })) : [];

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "New Service Request",
        text: emailText,
        attachments,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Error sending email. Please try again." });
        }

        // Cleanup uploaded files
        if (files && files.length > 0) {
            files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    }
                });
            });
        }

        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Service request submitted successfully" });
    });
};

module.exports = processServiceRequest;