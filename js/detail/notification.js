/*** Local Notification Solution - work when you assign notification permission on browser and enable show notification of browser in system notification */
// distinctTag for only 1 message with the same tag
// icon for show down or up point of ccq
function sendLocalNotification(
  title,
  detailMessage,
  externalInfor,
  distinctTag
) {
  Notification.requestPermission().then((permissionResult) => {
    // permissionResult: ['granted', 'default', 'denied']
    console.log(permissionResult);
    if (permissionResult === "granted") {
      console.log("vào");
      const notification = new Notification(title, {
        body: detailMessage,
        data: externalInfor,
        icon: CONSTANT_SMART_INVEST_ICON_URL,
        tag: distinctTag,
      });
      console.log(notification);

      notification.addEventListener("error", (exception) => {
        // exception contain data (externalInfor)
        console.error(exception);
      });
    }
  });
}

function genTitleNotifyCcqImpact(ccqShortName, impactPercent) {
  if (impactPercent < 0) {
    // decrease
    return ccqShortName + " has decreased " + impactPercent + "%";
  } else {
    // increase
    impactPercent = "+" + impactPercent;
    return ccqShortName + " has increased " + impactPercent + "%";
  }
}

function genDetailMessage() {
  return "This is predict value which is based on component report in previous month of CCQ's Company";
}

/**** Another solution: Push notification  */
// function pushNotification(message){
//     if (!('serviceWorker' in navigator)) {
//         // Service Worker isn't supported on this browser, disable or hide UI.
//         console.error("Service Worker isn't supported on this browser");
//         return;
//     }

//     if (!('PushManager' in window)) {
//         // Push isn't supported on this browser, disable or hide UI.
//         console.error("Push isn't supported on this browser");
//         return;
//     }
// }

// // permissionResult: ['granted', 'default', 'denied']
// function askPermission(resolve, reject) {
//     return new Promise(function (resolve, reject) {
//       const permissionResult = Notification.requestPermission(function (result) {
//         resolve(result);
//       });

//       if (permissionResult) {
//         permissionResult.then(resolve, reject);
//       }
//     }).then(function (permissionResult) {
//       if (permissionResult !== 'granted') {
//         throw new Error("We weren't granted permission.");
//       }
//     });
// }

// // create service worker file and modify path in this function
// // serviceWorkerJsFilePath: /service-worker.js
// async function registerServiceWorker(serviceWorkerJsFilePath) {
//     return await navigator.serviceWorker
//       .register(serviceWorkerJsFilePath)
//       .then(function (registration) {
//         console.log('Service worker successfully registered.');
//         return registration;
//       })
//       .catch(function (err) {
//         console.error('Unable to register service worker.', err);
//       });
// }

// // create service worker file and modify path in this function
// // publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
// async function subscribeUserToPush(serviceWorkerJsFilePath, publicKey) {
//     return await navigator.serviceWorker
//       .register(serviceWorkerJsFilePath)
//       .then(function (registration) {
//         const subscribeOptions = {
//           userVisibleOnly: true,
//           applicationServerKey: urlBase64ToUint8Array(
//             publicKey,
//           ),
//         };

//         return registration.pushManager.subscribe(subscribeOptions);
//       })
//       .then(function (pushSubscription) {
//         console.log(
//           'Received PushSubscription: ',
//           JSON.stringify(pushSubscription),
//         );
//         return pushSubscription;
//       });
//   }
