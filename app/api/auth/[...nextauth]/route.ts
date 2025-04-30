import NextAuth from "next-auth"
import { getAuth } from "firebase-admin/auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
// import { FirestoreAdapter } from "@auth/firebase-adapter";
import { signInWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { signIn } from "next-auth/react"

import { compare } from "bcryptjs"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials!.email,
            credentials!.password
          );
          const user = userCredential.user;
    
          return {
            id: user.uid,
            name: user.displayName || "",
            email: user.email,
            image: user.photoURL || null,
          };
        } catch (err) {
          console.error("Firebase signIn error", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }: any) {
      const ref = doc(db, "users", user.email || user.id);
      await setDoc(ref, {
        name: user?.name,
        email: user?.email,
        image: user?.image,
        lastLogin: new Date(),
        createdAt: serverTimestamp(),
        role: "user", // or whatever you want
      }, { merge: true });

      return true;
    },
    async session({ session, token }: any) {
      if (session.user?.email) {
        const ref = doc(db, "users", session.user.email);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          session.user.metadata = snap.data();
        }
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
