# 2 Factor Authentication

A basic Node.js server to handle 2 factor authentication. One service generates and returns a SHA1 secret key with base64 encoded image data for the QR code, the other verifies a TOTP (time based one time password) for a given user id. You'll need to implement database storage for the shared key with a user id primary key,the latter of which is passed to the verify service.
Uses nodemon to automatically restart the server when code changes are saved.
Sample tests written using Mocha and Chai will follow.

## Usage

1. Clone the repository
2. Install the dependencies `npm install`
3. Change the jwtSecretKey in `server.js`
4. Add an authentication check as required, for example from users in a database.
5. Start the server `nodemon server.js`
6. Make web service requests as described below; you could use Postman to experiment.

### Generate and return a new shared key and base64 encoded image data for the QR code

Create a GET request to http://localhost:8080/create-shared-key and extract the data from the JSON response.

The response body should contain JSON like this, or an error message:

```
  {
    "success": true,
    "secretKey" : "JZTGKSSBGNXTY7LQKEUWW2D2NMZVGVJO",
    "qrCodeData: "data:image/png;base64,iVBORw0KGgoAAA..."
  }
```

Display the QR code to the user like this:

```
<img alt="QR code" src="data:image/png;base64,iVBORw0KGgoAAA..." />
```

### Verify a TOTP for a given user id

Create a POST request to http://localhost:8080/verify-totp

```
  {
    userId: 123456,
    totp: 222444
  }
```

The response body should contain JSON like this, or an error message:

```
  {
    "success": true,
    "message": "TOTP is valid"
  }
```
