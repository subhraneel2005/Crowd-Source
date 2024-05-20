"use client"

import { auth } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";


export default function UserDashboard(){
    const auth = getAuth();
    const user = auth.currentUser;


    return(
        <div>
            UserDashboard
            name:{user.displayName}
            email:{user.email}
        </div>
    )
}