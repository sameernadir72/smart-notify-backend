import { Injectable } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    // We only want to initialize Firebase once!
    if (!getApps().length) {
      // Safely find the firebase-key.json file in the root of your project
      const keyPath = path.resolve(process.cwd(), 'firebase-key.json');

      initializeApp({
        credential: cert(require(keyPath)),
      });
      console.log('🔥 Firebase Admin SDK Initialized Successfully!');
    }
  }

  // The method the Cron Job will call to send the actual push notification
  async sendPushNotification(fcmToken: string, title: string, body: string) {
    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: fcmToken,
      };

      // Send to Firebase!
      const response = await getMessaging().send(message);
      console.log('✅ Successfully sent push notification:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
    }
  }
}
