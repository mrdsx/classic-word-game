import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  debugErrorMap,
  indexedDBLocalPersistence,
  initializeAuth,
  type ActionCodeSettings,
  type Auth,
} from "firebase/auth";
import { FRONTEND_URL } from "./constants";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} satisfies FirebaseOptions;

export const actionCodeSettings = {
  url: FRONTEND_URL,
  handleCodeInApp: true,
} satisfies ActionCodeSettings;

export const firebase: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = initializeAuth(firebase, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  errorMap: debugErrorMap,
});

if (import.meta.env.MODE === "development") {
  console.log("Connecting to firebase emulators");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}
