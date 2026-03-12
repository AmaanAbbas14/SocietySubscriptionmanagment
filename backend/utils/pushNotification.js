const admin = require("../config/firebase");

const sendPushNotification = async (deviceToken, title, message) => {

 const payload = {
  notification: {
   title: title,
   body: message
  }
 };

 await admin.messaging().send({
  token: deviceToken,
  notification: payload.notification
 });

};

module.exports = sendPushNotification;