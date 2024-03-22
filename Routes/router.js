const express = require('express');
const router = new express.Router();
const nodeMailer = require('nodemailer');

// Middleware to parse JSON request bodies
router.use(express.json());


router.post("/register", (req, res) => {
    const { company, email, mobile, userType, country, message } = req.body;

    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "contact@adiance.com",
                pass: "gxedhzxryiwblyfm",
            }
        });

        const mailOptions = {
            from: "contact@adiance.com",
            to: "contact@adiance.com",
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
                // console.log('Email sent: ' + info.response);
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
                user: "contact@adiance.com",
                pass: "gxedhzxryiwblyfm",
            }
        });

        const mailOptions = {
            from: "contact@adiance.com",
            to: "contact@adiance.com",
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
                // console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});


let otpDatabase;

router.post('/generate-otp', (req, res) => {
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpDatabase = otp;

    // Sending OTP via email (using nodemailer)
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: "contact@adiance.com",
            pass: "gxedhzxryiwblyfm",
        }
    });
  
    const mailOptions = {
      from: 'contact@adiance.com', // Your email address
      to: 'contact@adiance.com', // Receiver's email address (received from frontend)
      subject: 'Blog Writing - Your OTP for verification',
      text: `Your OTP is: ${otp}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to generate OTP' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ otp, message: 'OTP generated and sent successfully at contact@adiance.com' });
      }
    });
  });

router.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
  
    // Check if the provided OTP matches the stored OTP
    if (otpDatabase && otpDatabase === parseInt(otp)) {
      // If OTP matches, reset the OTP database
      otpDatabase = undefined;
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      // If OTP doesn't match or not found, return error message
      res.status(400).json({ message: 'Invalid OTP' });
    }
  });
  


module.exports = router;
