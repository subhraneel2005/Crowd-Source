"use client"

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";


export default function AuthPage(){

    const provider = new GoogleAuthProvider();
    const router = useRouter();
    
    const googleAuthHandler = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
  
          router.push("/dashboard")
          
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }

    return(
        <div className="min-h-screen w-full flex justify-center items-center">
            <button className="btn btn-active btn-primary" onClick={googleAuthHandler}>Sign in with Google</button>
        </div>
    )
}