// firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCEgDIVb31_wgaecagh366VQaisJ8RzMlY",
  authDomain: "showfer-ai.firebaseapp.com",
  projectId: "showfer-ai",
  storageBucket: "showfer-ai.appspot.com",
  messagingSenderId: "219711617825",
  appId: "1:219711617825:web:4ffe9a03cb390ee40f1c60",
  measurementId: "G-32Z0CZSD82",
};

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

export { app, analytics };
