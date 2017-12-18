# 2 Factor Authentication

A Node.js RESTful API to handle 2 factor authentication using speakeasy. One API generates and returns a SHA1 secret key with base64 encoded image data for the QR code, the other verifies a TOTP (time based one time password) for a given user id. The shared key should be stored in a database with the user id (primary key), the latter of which is passed to the verify service. Note that it's important to implement the database storage because the shared key itself should never be visible in a verification HTTP request.
Uses nodemon to automatically restart the server when code changes are saved.
Includes tests written using Mocha and Chai.

## Usage

1. Clone the repository and change the siteName variable in server.js to reflect the label you want displayed in the authenticator app.
2. Install the dependencies `npm install`
3. Start the server `nodemon server.js`
4. Make web service requests as described below; you could use Postman to experiment.
5. Run the tests `npm run test`

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
