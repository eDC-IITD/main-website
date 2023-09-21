let fs = require('fs').promises;
let path = require('path');
let process = require('process');
let dotenv = require("dotenv");

let express = require("express");
let cors = require("cors");

dotenv.config();

let app = express();
let port = process.env.port || 3000;

let nodemailer = require("nodemailer");

let { authenticate } = require('@google-cloud/local-auth');
let { google } = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'client/api/contact_us/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client/api/contact_us/credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// end of google authentication code -------------------------------------

// update google sheets ---------------------------------------------------
async function updateSheets(name, email, subject, message) {
  let sheets = google.sheets({ version: 'v4', auth: await authorize() });
  sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: "Sheet1!A1:D1000",
    valueInputOption: "RAW",
    resource: {
      values: [[name, email, subject, message],],
    }
  });
}

// initiating node mailer for sending emails ---------------------------------
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAILER_ID,
    pass: process.env.MAILER_APP_PASSWORD,
  },
  debug: true,
});
function sendMail(targetEmail, targetName) {
  var mailOptions = {
    from: process.env.MAILER_ID,
    to: targetEmail,
    subject:
      "Thankyou for reaching out us, Entreprenuership Development Cell IIT Delhi",
    html: `
      Dear ${targetName},<br><br>
      You will hear from us,with in 2-3 days.<br><br>
      eDC IIT Delhi<br>
 `,
  };
  var status = transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      return false
    } else {
      console.log("Message sent: " + info.response);
      return true
    }
  });
  return status
}
// start of express server code ---------------------------------------------
app.use(express.json());
app.use(cors());
app.post("/", async (req, res) => {

  // authorization for request --> accepted only local host (developmental purpose) || edciitd.ac.in
  if (req.hostname == "localhost" || "edciitd.ac.in") {

    if (req.query.name && req.query.email && req.query.subject && req.query.message) {

      var name, email, subject, message, encErrors;
      name = req.query.name;
      email = req.query.email;
      subject = req.query.subject;
      message = req.query.message;
      encErrors = [] // error codes are the fitst alphabet of function selector mapping to numbers

      try { //try updating sheets
        await updateSheets(name, email, subject, message).catch(e => {
          console.log(e)
          throw e
        })
      } catch (error) {
        encErrors.push(21)
        console.log(error);
      }

      //if sheets updated successfully
      if (encErrors.length == 0) {
        sendMail(email, name)
        res.status(200);
        res.json("success");
      } else {
        res.status(400);
        res.json("failed to update sheets")
      }
    } else {
      res.status(417);
      res.json("insufficient query parameters");
    }
  } else {
    res.status(403);
    res.json("Not allowed");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
