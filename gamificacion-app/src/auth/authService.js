import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

const provider = new GoogleAuthProvider();

// Detectamos entorno local
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const loginWithGoogle = () => {
  if (isLocalhost) {
    console.log("Login with POPUP (local)");
    return signInWithPopup(auth, provider);
  }

  console.log("Login with REDIRECT (prod)");
  return signInWithRedirect(auth, provider);
};
