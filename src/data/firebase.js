import app from 'firebase/app';
import 'firebase/firestore/memory';

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
};

app.initializeApp(config);

app.firestore().settings({ });

// app.firestore.setLogLevel('debug');

export default app;