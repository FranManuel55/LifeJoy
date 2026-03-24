import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => {
  console.log("Login with POPUP");
  return signInWithPopup(auth, provider);
};
