// Description
// Upload a Twilio Asset via the API
// Documentation:

/*
Step #1
Asset "Create Asset"
* This gives us an Asset SID
https://www.twilio.com/docs/runtime/functions-assets-api/api/asset
Step #2
Create an Asset Version resource
* Requires Asset SID from Step #1
* Note: The create action is not supported by the helper libraries.
https://www.twilio.com/docs/runtime/functions-assets-api/api/asset-version#create-an-asset-version-resource
*/

const axios = require('axios');
const qs = require('qs');
const FormData = require('form-data');
const fs = require('fs');

// ** START NECESSARY CONFIGURATION **
// Make sure the environmental variable exist: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
const functionServiceSid = 'ZSdaff9c252bbd0328623e82c19db7d37c';
const fileToUpload = '/Users/aklein/Downloads/twilionode/WinstonPaw.jpg';
const assetPath = '/WinstonBoyRocks';
const assetFriendlyName = 'winstonRocks';
// ** END NECESSARY CONFIGURATION **

const createAssetSidURL = `https://serverless.twilio.com/v1/Services/${functionServiceSid}/Assets`;

let data = new FormData();
data.append('Content', fs.createReadStream(fileToUpload));
data.append('Path', assetPath);
data.append('Visibility', 'public');

function createAssetSid(url, friendlyName) {
  const config = {
    url,
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN,
    },
    method: 'post',
    data: qs.stringify({
      FriendlyName: friendlyName,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  return axios(config)
    .then((result) => {
      console.log(result.data);
      return result;
    })
    .catch((err) => {
      console.log(err.response);
    });
}

function uploadAsset(assetSid) {
  const createAnAssetVersionResourceURL = `https://serverless-upload.twilio.com/v1/Services/${functionServiceSid}/Assets/${assetSid}/Versions`;

  const config = {
    url: createAnAssetVersionResourceURL,
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN,
    },
    headers: {
      ...data.getHeaders(),
    },
    method: 'post',
    data: data,
  };

  return axios(config)
    .then((result) => {
      console.log(result.data);
      return result;
    })
    .catch((err) => {
      console.log(err.response);
    });
}

createAssetSid(createAssetSidURL, assetFriendlyName).then((result) => {
  console.log(result.data);
  uploadAsset(result.data.sid)
    .then((result) => {
      console.log(result.data);
    })
    .catch((err) => {
      console.log(err.response);
    });
});