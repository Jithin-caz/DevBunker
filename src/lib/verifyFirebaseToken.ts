/* eslint-disable no-var */
import admin from "./firebaseAdmin";

export async function verifyFirebaseToken(token: string) {
  try {
    
    var decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
<<<<<<< HEAD
    console.error(error);
=======
    console.error("Error verifying Firebase token:", error);
>>>>>>> e9911a6d7e3d83714c1e99ce2f04048c5d03872b
    throw new Error("Invalid Firebase token");
  }
}
