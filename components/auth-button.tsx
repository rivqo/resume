"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

interface AuthButtonProps {
  text: string
  isLoading?: boolean
}

const provider = new GoogleAuthProvider();
const auth = getAuth();

export function GoogleAuthButton({ text, isLoading = false }: AuthButtonProps) {
  const [loading, setLoading] = useState(false)

  // const handleGoogleSignIn = async () => {
  //   try {
  //     // setLoading(true)
  //     // await signIn("google", { callbackUrl: "/dashboard" })

  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     const idToken = await user.getIdToken();
      
  //     return user;
  //   } catch (error) {
  //     console.error("Error signing in with Google:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
  
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log(user)
  
      // Use NextAuth "credentials" to pass Firebase ID token
      const response = await signIn("firebase-token", { idToken, callbackUrl: "/dashboard" });
  
      if (!response?.ok) {
        throw new Error("Failed to sign in with credentials.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading || loading}
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      {isLoading || loading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      {text} with Google
    </Button>
  )
}
