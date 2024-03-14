const express = require('express');
const router = new express.Router();
const nodeMailer = require('nodemailer');

// Middleware to parse JSON request bodies
router.use(express.json());

router.post("/register", (req, res) => {
    const { company, email, mobile, userType, country, message } = req.body;

    try {
        // console.log(req.body);
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "bhaibhaihudhuddabang@gmail.com",
                pass: "maadhtfkjjluwahs",
            }
        });

        const mailOptions = {
            from: "bhaibhaihudhuddabang@gmail.com",
            to: "bhaibhaihudhuddabang@gmail.com",
            subject: "Sending Requirements to Adiance",
            html: `
                <h1>New Requirement Received</h1>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>User Type:</strong> ${userType}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error occurred while sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

router.post("/feedback", (req, res) => {
    const { name,email,company,mobile,country,skype,subject,message } = req.body;

    try {
        // console.log(req.body);
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "bhaibhaihudhuddabang@gmail.com",
                pass: "maadhtfkjjluwahs",
            }
        });

        const mailOptions = {
            from: "bhaibhaihudhuddabang@gmail.com",
            to: "bhaibhaihudhuddabang@gmail.com",
            subject: "Sending Feedback to Adiance",
            html: `
                <h1>${subject}</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>skype:</strong> ${skype}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error occurred while sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
