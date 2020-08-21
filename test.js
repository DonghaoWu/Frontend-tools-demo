import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDN4tbAvlaC3zxQjN4vUw0bX8AmGFCa9co",
    authDomain: "clothing-friends.firebaseapp.com",
    databaseURL: "https://clothing-friends.firebaseio.com",
    projectId: "clothing-friends",
    storageBucket: "clothing-friends.appspot.com",
    messagingSenderId: "602150897422",
    appId: "1:602150897422:web:e7efaca1dff7f74802b95f",
    measurementId: "G-8D7LR6M67M"
};

firebase.initializeApp(firebaseConfig);

const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};