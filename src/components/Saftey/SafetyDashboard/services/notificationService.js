// services/notificationService.js
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { requestNotificationPermission, onMessageListener } from '../firebase';
import axios from 'axios';

class NotificationService {
  constructor() {
    this.unsubscribeCallbacks = new Map();
    this.isInitialized = false;
  }

  // Initialize notification service
  async initialize(userId) {
    if (this.isInitialized) return;

    try {
      // Request notification permission and get FCM token
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        // Store FCM token on server
        await this.storeFCMToken(fcmToken);
        
        // Set up foreground message listener
        this.setupForegroundListener();
        
        // Set up real-time notification listener
        this.subscribeToNotifications(userId);
        
        this.isInitialized = true;
        console.log('Notification service initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Store FCM token on server
  async storeFCMToken(fcmToken) {
    try {
      const token = localStorage.getItem('token_real');
      await axios.post('/api/notifications/fcm-token', 
        { fcmToken },
        { headers: { 'x-auth-token': token } }
      );
    } catch (error) {
      console.error('Error storing FCM token:', error);
    }
  }

  // Set up foreground message listener
  setupForegroundListener() {
    onMessageListener()
      .then((payload) => {
        console.log('Received foreground message:', payload);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/firebase-logo.png',
            badge: '/firebase-logo.png',
            tag: 'notification-tag'
          });
        }
        
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('firebaseNotification', {
          detail: payload
        }));
      })
      .catch((error) => console.error('Error in foreground listener:', error));
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      
      if (callback) {
        callback(notifications);
      }
      
      // Trigger custom event for UI updates
      window.dispatchEvent(new CustomEvent('notificationsUpdated', {
        detail: { notifications }
      }));
    });

    this.unsubscribeCallbacks.set(userId, unsubscribe);
    return unsubscribe;
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications(userId) {
    const unsubscribe = this.unsubscribeCallbacks.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeCallbacks.delete(userId);
    }
  }

  // Send identity request (Admin action)
  async requestIdentity(reportId) {
    try {
      const token = localStorage.getItem('token_real');
      const response = await axios.post(
        `/api/notifications/request-identity/${reportId}`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting identity:', error);
      throw error;
    }
  }

  // Respond to identity request (User action)
  async respondToIdentityRequest(notificationId, approved, reportId) {
    try {
      const token = localStorage.getItem('token_real');
      const response = await axios.post(
        `/api/notifications/identity-response/${notificationId}`,
        { approved, reportId },
        { headers: { 'x-auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Error responding to identity request:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem('token_real');
      await axios.patch(
        `/api/notifications/read/${notificationId}`,
        {},
        { headers: { 'x-auth-token': token } }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Clean up
  cleanup() {
    this.unsubscribeCallbacks.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.unsubscribeCallbacks.clear();
    this.isInitialized = false;
  }
}

export default new NotificationService();