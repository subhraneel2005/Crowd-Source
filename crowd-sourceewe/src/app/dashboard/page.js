"use client"

import { auth } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";


export default function UserDashboard(){
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    const logOut = () => {
        auth.signOut();
        router.push("/");
    }

    if(!user){
        router.push("/auth");
    }

    return(
    <div className="h-screen flex">
      <div className="bg-gradient-to-r from-lime-600 to-yellow-600 w-64 h-screen p-4">
        <ul className="mt-32 space-y-5 font-bold">
          <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500">Create Community</li>
          <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500">See your Communities</li>
          <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500">User Details</li>
          <li className="text-white py-2 border-2 border-red-500 rounded-xl cursor-pointer text-center hover:bg-red-600 duration-500" onClick={logOut}>Log Out</li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold">{user?.displayName} Dashboard</h1>
      </div>
    </div>
    )
}