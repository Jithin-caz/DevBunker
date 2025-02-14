/* eslint-disable no-var */
import admin from "./firebaseAdmin";

export async function verifyFirebaseToken(token: string) {
  try {
    
    var decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid Firebase token");
  }
}
