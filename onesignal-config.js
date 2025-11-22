// ============================================
// ONESIGNAL PUSH NOTIFICATION CONFIGURATION
// ============================================
// This file handles all OneSignal initialization and push notification setup
// Works even when app is CLOSED (important for Android APK)

const ONESIGNAL_APP_ID = '4d8d6572-7530-4341-b6c7-58a8f2eda340'; // Your OneSignal App ID

// Initialize OneSignal (v16 - initialization now happens in index.html)
export const initializeOneSignal = () => {
    try {
        console.log('🔔 OneSignal v16 is initialized in index.html...');
        
        // Check if OneSignal is available
        if (typeof window.OneSignalDeferred === 'undefined') {
            console.error('❌ OneSignal SDK not loaded. Check your index.html script tags.');
            return;
        }

        // Set up event listeners once OneSignal is ready
        window.OneSignalDeferred.push(async function(OneSignal) {
            console.log('✅ OneSignal ready, setting up listeners...');
            await setupOneSignalListeners(OneSignal);
        });

    } catch (error) {
        console.error('❌ Error initializing OneSignal:', error);
    }
};

// Set up OneSignal event listeners (v16 compatible)
const setupOneSignalListeners = async (OneSignal) => {
    try {
        // Listen for notification permission changes
        OneSignal.Notifications.addEventListener('permissionChange', (granted) => {
            console.log('🔔 Permission changed:', granted ? 'GRANTED' : 'DENIED');
        });

        // Listen for push subscription changes
        OneSignal.User.PushSubscription.addEventListener('change', (subscription) => {
            console.log('🔔 Push subscription changed:', subscription);
            if (subscription.current.optedIn) {
                console.log('✅ User is subscribed to push notifications');
            } else {
                console.log('❌ User is NOT subscribed to push notifications');
            }
        });

        // Listen for notification clicks
        OneSignal.Notifications.addEventListener('click', (event) => {
            console.log('🔔 Notification clicked:', event);
        });

    } catch (error) {
        console.error('❌ Error setting up listeners:', error);
    }
};

// Request notification permission from user (v16 API)
export const requestNotificationPermission = async () => {
    return new Promise((resolve) => {
        window.OneSignalDeferred.push(async function(OneSignal) {
            try {
                console.log('📱 Requesting notification permission...');
                
                const permission = await OneSignal.Notifications.requestPermission();
                
                if (permission) {
                    console.log('✅ Notification permission GRANTED');
                    await getUserId();
                    resolve(true);
                } else {
                    console.log('❌ Notification permission DENIED');
                    resolve(false);
                }
            } catch (error) {
                console.error('❌ Error requesting permission:', error);
                resolve(false);
            }
        });
    });
};

// Get OneSignal Player ID (unique user identifier) - v16 API
export const getUserId = async () => {
    return new Promise((resolve) => {
        window.OneSignalDeferred.push(async function(OneSignal) {
            try {
                const userId = OneSignal.User.PushSubscription.id;
                console.log('👤 OneSignal Subscription ID:', userId);
                
                // Store in localStorage for future use
                if (userId) {
                    localStorage.setItem('onesignal_player_id', userId);
                }
                
                resolve(userId);
            } catch (error) {
                console.error('❌ Error getting user ID:', error);
                resolve(null);
            }
        });
    });
};

// Check if user is subscribed (v16 API)
export const isUserSubscribed = async () => {
    return new Promise((resolve) => {
        window.OneSignalDeferred.push(async function(OneSignal) {
            try {
                const permission = await OneSignal.Notifications.permission;
                const optedIn = OneSignal.User.PushSubscription.optedIn;
                console.log('🔔 Permission:', permission, '| Opted In:', optedIn);
                resolve(permission && optedIn);
            } catch (error) {
                console.error('❌ Error checking subscription:', error);
                resolve(false);
            }
        });
    });
};

// Send a tag to OneSignal (for user segmentation) - v16 API
export const setUserTag = async (key, value) => {
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            await OneSignal.User.addTag(key, value);
            console.log(`✅ Tag set: ${key} = ${value}`);
        } catch (error) {
            console.error('❌ Error setting tag:', error);
        }
    });
};

// Send tags for user preferences (v16 API)
export const setUserPreferences = async (username, userRole = 'user') => {
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            await OneSignal.User.addTags({
                username: username,
                role: userRole,
                app: 'cakewait',
                timestamp: new Date().toISOString()
            });
            console.log('✅ User preferences saved to OneSignal');
        } catch (error) {
            console.error('❌ Error setting preferences:', error);
        }
    });
};

// Unsubscribe from notifications (v16 API)
export const unsubscribeFromNotifications = async () => {
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            await OneSignal.User.PushSubscription.optOut();
            console.log('✅ Unsubscribed from notifications');
        } catch (error) {
            console.error('❌ Error unsubscribing:', error);
        }
    });
};

// Re-subscribe to notifications (v16 API)
export const subscribeToNotifications = async () => {
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            await OneSignal.User.PushSubscription.optIn();
            console.log('✅ Subscribed to notifications');
        } catch (error) {
            console.error('❌ Error subscribing:', error);
        }
    });
};
