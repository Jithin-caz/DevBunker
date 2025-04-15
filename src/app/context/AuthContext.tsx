"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: any;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      console.log("Token from signInWithGoogle:", idToken); // Debug log

      const res = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) throw new Error("Backend auth failed");
      const data = await res.json();
      setUser(data);
      setToken(idToken);
    } catch (error: any) {
      console.error("Error in signInWithGoogle:", error.message);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setToken(null);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        console.log("Token from onAuthStateChanged:", idToken); // Debug log
        const res = await fetch("/api/auth/firebase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setToken(idToken);
        } else {
          console.error("Backend auth failed in onAuthStateChanged");
        }
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
