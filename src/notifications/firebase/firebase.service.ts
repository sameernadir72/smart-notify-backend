import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    // We only want to initialize Firebase once!
    if (!admin.apps.length) {
      // Safely find the firebase-key.json file in the root of your project
      const keyPath = path.resolve(process.cwd(), 'firebase-key.json');

      admin.initializeApp({
        credential: admin.credential.cert(require(keyPath)),
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
      const response = await admin.messaging().send(message);
      console.log('✅ Successfully sent push notification:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
    }
  }
}
