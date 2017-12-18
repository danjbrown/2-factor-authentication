const express 			= require('express');
const app         		= express();
const bodyParser  		= require('body-parser');
const expressValidator  = require('express-validator');
const speakeasy         = require('speakeasy');
const QRCode            = require('qrcode');

// Config vars
const siteName = "My Website";

// Server config
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

// Generate and return a new secret key (SHA1) and base64 encoded QR code image data
app.get('/create-secret-key', function(req, res) {
    const secret = speakeasy.generateSecret();

    const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: siteName
    });

    QRCode.toDataURL(encodeURI(otpAuthUrl), function(err, imageData) {
        res.status(200).json({
            success: true,
            secretKey: secret.base32,
            qrCodeData: imageData
        });
    });
});

// verfiy the TOTP (time based one time password)
app.post('/verify-totp', function(req, res) {
    req.checkBody("totp", "Invalid TOTP").isInt();
    req.checkBody("userId", "Invalid userId").isInt();

    // get the secret key for the user from the database
    const secret = '';

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            res.status(400).json({success: false, message: result.array()});
        } else {
            // what is the current TOTP?
            const currentTotp = speakeasy.totp({
              secret: secret,
              encoding: 'base32'
            });

            // is the user entered TOTP valid?
            if (currentTotp == req.body.totp) {
                return res.status(200).json({
                    success: true,
                    message: 'TOTP is valid'
                });
            }
            
            return res.status(400).json({
                success: false,
                message: 'Invalid TOTP'
            });
        }
    });
});

app.listen(port);
console.log('2 factor authentication server running at http://localhost:' + port);

module.exports = app; // for testing
