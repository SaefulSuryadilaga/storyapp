import Swal from 'sweetalert2';
import { convertBase64ToUint8Array } from '.';
import CONFIG from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    Swal.fire({
      title: 'Permission denied',
      icon: 'error',
      text: 'Notification permission is denied.',
    });

    return false;
  }

  if (status === 'default') {
    Swal.fire({
      title: 'Permission info',
      icon: 'info',
      text: 'Notification permission closed or ignored.',
    });

    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    Swal.fire({
      title: 'Subscribe info',
      icon: 'info',
      text: 'Subscribed for push notification.',
    });

    return;
  }

  console.log('Subscribing push notification...');

  const failureSubscribeMessage = 'Fail to subscribe web push notification.';

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: response:', response);

      Swal.fire({
        title: 'Subscribe Failed',
        icon: 'error',
        text: failureSubscribeMessage,
      });

      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();

      return;
    }

    Swal.fire({
      title: 'Subscribe Successfully!',
      icon: 'success',
      text: response.message,
    });
  } catch (error) {
    console.error('subscribe: error:', error);

    Swal.fire({
      title: 'Subscribe Failed',
      icon: 'error',
      text: failureSubscribeMessage,
    });

    // Undo subscribe to push notification
    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Fail to unsubscribe web push notification.';

  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      Swal.fire({
        title: 'Unsubscribe Failed',
        icon: 'error',
        text: 'Not subscribed before',
      });

      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      Swal.fire({
        title: 'Unsubscribe Failed',
        icon: 'error',
        text: failureUnsubscribeMessage,
      });

      console.error('unsubscribe: response:', response);

      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      Swal.fire({
        title: 'Unsubscribe Failed',
        icon: 'error',
        text: failureUnsubscribeMessage,
      });

      await subscribePushNotification({ endpoint, keys });

      return;
    }

    Swal.fire({
      title: 'Unsubscribe Successfully!',
      icon: 'success',
      text: response.message,
    });
  } catch (error) {
    Swal.fire({
      title: 'Unsubscribe Failed',
      icon: 'error',
      text: failureUnsubscribeMessage,
    });

    console.error('unsubscribe: error:', error);
  }
}
