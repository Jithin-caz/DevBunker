import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";



export default async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const response = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Backend authentication failed");
    }
    const data = await response.json();
    return {
      ...data,
      token,
    };
  } catch (err) {
    console.log(err);
  }
}
