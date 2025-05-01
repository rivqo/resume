import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { compare } from "bcryptjs";
import { auth, db } from "@/lib/firebase";
import { adminDb, FieldValue } from "@/lib/firebase-admin";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "email-password", // <- Unique ID
      name: "EmailPassword",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials!;
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
    
          return {
            id: user.uid,
            name: user.displayName || "",
            email: user.email,
            image: user.photoURL || null,
          };
        } catch (err) {
          console.error("Email/password login failed", err);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "firebase-token", // <- Unique ID
      name: "FirebaseToken",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials?.idToken;
        if (!idToken) return null;
    
        try {
          const { adminAuth } = await import("@/lib/firebase-admin");
          const decoded = await adminAuth.verifyIdToken(idToken);
        
          const { uid, email, name, picture } = decoded;
          console.log("Decoded token:", decoded);
        
          return {
            id: uid,
            email,
            name,
            image: picture || null,
          };
        } catch (err) {
          console.error("Invalid Firebase token", err);
          return null;
        }
      },
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
          console.error("Firebase Email/Password login failed:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }: any) {
      const uid = account?.provider === "google" 
        ? account.id 
        : user.id || user.uid;

      if (!uid) return false;
      // const firebaseUser = await getAuth().getUserByEmail(user.email);
      // console.log("Firebase UID:", firebaseUser.uid); 
      console.log("User UID:", uid)

      const ref = adminDb.doc(`users/${uid}`);
      await ref.set(
        {
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date(),
          createdAt: FieldValue.serverTimestamp(),
          role: "user",
        },
        { merge: true }
      );

      return true;
    },

    async session({ session, token }: any) {
      if (session.user && token?.sub) {
        const uid = token.sub; // Firebase UID or Google sub
        const ref = adminDb.collection("users").doc(uid);
        const snap = await ref.get();

        if (snap.exists) {
          session.user.metadata = snap.data();
          session.user.uid = token.uid;
        }
      }

      return session;
    },

    async jwt({ token, user }: any) {
      if (user?.id) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }