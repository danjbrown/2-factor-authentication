var express 			= require('express');
var app         		= express();
var bodyParser  		= require('body-parser');
var expressValidator  	= require('express-validator');
var speakeasy           = require('speakeasy');
var QRCode              = require('qrcode');

var secretKeyLength = 20;

// Server config
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

// Generate and return a new secret key and QR code image data
app.get('/create-secret-key', function(req, res) {
    var secret = speakeasy.generateSecret({length: secretKeyLength});
    var otpAuthUrl = encodeURI('otpauth://totp/My Site?secret='+secret);

    QRCode.toDataURL(secret.otpauth_url, function(err, imageData) {
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
    var secret = '';

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            res.status(400).json({success: false, message: result.array()});
        } else {
            // what is the current TOTP?
            var token = speakeasy.totp({
              secret: secret,
              encoding: 'base32'
            });

console.log(req.query.totp);

            if (token === req.query.totp) {
                res.status(200).json({
                    success: true,
                    message: 'TOTP is valid'
                });
            }

            res.status(400).json({success: false, message: 'Invalid TOTP'});
        }
    });
});

app.listen(port);
console.log('2 factor authentication server running at http://localhost:' + port);

module.exports = app; // for testing
