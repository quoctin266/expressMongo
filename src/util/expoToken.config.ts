import { Expo } from "expo-server-sdk";

interface dataToken {
  token: string;

  data: string;
}

let expo = new Expo({
  useFcmV1: true,
});

export const pushToken = (dataTokens: dataToken[]) => {
  // Create the messages that you want to send to clients
  let messages = [];
  for (let dataToken of dataTokens) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(dataToken.token)) {
      console.error(
        `Push token ${dataToken.token} is not a valid Expo push token`
      );
      continue;
    }

    messages.push({
      to: dataToken.token,
      title: "You have an updated course",
      body: `${dataToken.data} has been updated`,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

// let receiptIds = [];
// for (let ticket of tickets) {
//    if (ticket.status === 'ok') {
//     receiptIds.push(ticket.id);
//   }
// }

// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       for (let receiptId in receipts) {
//         let { status, message, details } = receipts[receiptId];
//         if (status === 'ok') {
//           continue;
//         } else if (status === 'error') {
//           console.error(
//             `There was an error sending a notification: ${message}`
//           );
//           if (details && details.error) {
//             console.error(`The error code is ${details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();
