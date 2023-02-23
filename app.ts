const fetch = require('node-fetch');
// these are constants so you 
var username = "username"
const password="password"
const gcsAccessKey = "gcsAccessKey"
const gcsBucket = "gcsBucket"
const appId = "appId"
var channelName="channelName"
const uid="uid"
 
const decoded = username + ":" + password;
const encoded = Buffer.from(decoded).toString("base64");
const body = JSON.stringify({
 channelName,
 uid,
 clientRequest: {},
});
const authorizationField = "Basic " + encoded;
const headers = {
 Authorization: authorizationField,
 "Content-Type": "application/json",
};
 
async function acquire() {
 // Acquire a new resource to start a recording
 const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`;
 try {
   const response = await fetch(url, {
     method: "POST",
     headers,
     body,
   });

    
const fetch = (url, init) =>
import('node-fetch').then(({ default: fetch }) => fetch('url',{   method: "POST", 
headers ,
body, }).then(res =>  res.json())
.then(body => console.log(body)));
 

   const resBody = await response.json();
   return resBody["resourceId"] 
 } catch (err) {
   console.error(
     `Failed to acquire agora resource for ${channelName}: ${err}`
   );
   return undefined;
 }
}
 
async function startRecording(liveSessionUid, password, gcsSecretKey) {
 // Start an Agora recording for given live session.
 const uid = 1;
 channelName = liveSessionUid;
 username = username;
 password = password;
 const resourceID = await acquire(); // Get resourceID from acquire.
 if (!resourceID) {
   return;
 }
 try {
   const url = `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resourceID}/mode/mix/start`;
   const clientRequest = {
     token: "",
     recordingConfig: {
       maxIdleTime: 120,
       streamTypes: 2,
       audioProfile: 1,
       channelType: 1,
       videoStreamType: 0,
       transcodingConfig: {
         width: 360,
         height: 640,
         fps: 30,
         bitrate: 600,
         mixedVideoLayout: 1,
         maxResolutionUid: "1",
       },
     },
     recordingFileConfig: {
       avFileType: ["hls", "mp4"],
     },
     storageConfig: {
       vendor: 6, // Google Cloud Storage
       region: 0, // The region parameter has no effect, whether or not it is set.
       bucket: gcsBucket,
       accessKey: gcsAccessKey,
       secretKey: gcsSecretKey,
     },
   };
   const respense2=await fetch(url, {
     method: "POST",
     headers,
     body: JSON.stringify({
       channelName,
       uid,
       clientRequest,
     }),
   });
   const res = respense2.json();
   return res;
 } catch (err) {
   console.error(
     `Failed trying to start a recording for ${channelName}: ${err}`
   );
 }
}
