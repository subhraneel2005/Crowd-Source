"use client"

import { auth } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {useState} from "react"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { storage } from "@/firebase/config";


export default function UserDashboard(){
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    const logOut = () => {
        auth.signOut();
        router.push("/");
    }

    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = now.getFullYear();
        return `${day}:${month}:${year}`;
      };
    
    const currentDate = getCurrentDate();

    const [communityTitle, setCommunityTitle] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityImg, setCommunityImg] = useState(null);
    const [communityTarget, setCommunityTarget] = useState(null);
    const [communityType, setCommunityType] = useState("");
    const [communityDonators, setCommunityDonators] = useState([]);
    const [communityStatus, setCommunityStatus] = useState("");

    const createNewCommunity = async(e) => {
        e.preventDefault();

        if(!communityTitle || !communityDescription || !communityTarget || !communityType){
            alert("Please fill in all fields");
        }

        else{
            let imgUrl = "";

        if (communityImg) {
        try {
            const storageRef = ref(storage, `community_images/${communityImg.name}`);
            await uploadBytes(storageRef, communityImg);
            imgUrl = await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("Failed to upload image");
            return;
        }
    }

        const newCommunity = {
            title: communityTitle,
            description: communityDescription,
            target: communityTarget,
            type: communityType,
            createdAt: currentDate,
            donators: communityDonators,
            img: imgUrl,
            createdBy: user?.email
        }

        try {
            await addDoc(collection(db, "communities"), newCommunity);
            alert("Community created successfully");
            setCommunityTitle("");
            setCommunityDescription("");
            setCommunityTarget("");
            setCommunityType("");
            // setCommunityImg(null);
        } catch (error) {
            console.log(error);
        }
        }
    }

    const discard = () => {
        setCommunityTitle("");
        setCommunityDescription("");
        setCommunityTarget("");
        setCommunityType("");
        setCommunityImg("");
    }

    const getUsersCommunity = async() => {

    }

    if(!user){
        router.push("/auth");
    }

    return(
    <div className="h-screen w-full flex">
        <div className="block space-y-5">
        <div className="flex justify-between">
        <div className="bg-gradient-to-r from-lime-600 to-yellow-600 w-64 h-screen p-4 hidden md:block">
        <ul className="mt-6 space-y-5 font-bold">
          <Popover>
            <PopoverTrigger>
            <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500 px-6">Create Community</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-5">
                    <Input required value={communityTitle} onChange={(e) => setCommunityTitle(e.target.value)} placeholder="Enter your community name"/>
                    <Textarea required value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} placeholder="What is your community about..."/>
                    <Input required value={communityType} onChange={(e) => setCommunityType(e.target.value)} placeholder="Community Type"/>
                    <Input required value={communityTarget} onChange={(e) => setCommunityTarget(e.target.value)} placeholder="What is your contribution goal" type="number"/>
        
                    <div className="flex justify-between px-3">
                    <button className="btn btn-success"onClick={createNewCommunity}>Submit</button>
                    <button className="btn btn-error" onClick={discard}>Cancel</button>
                    </div>
                </div>
            </PopoverContent>
          </Popover>
          <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500">See your Communities</li>
          <li>
          <Popover>
            <PopoverTrigger>
            <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500 px-14">User Details</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-6 overflow-hidden">
                    <img src={user?.photoURL} className="rounded-full h-20 w-20"/>
                    <h1>{user?.displayName}</h1>
                    <p className="text-sm">{user?.email}</p>
                </div>
            </PopoverContent>
          </Popover>
          </li>
          <li>
          <Popover>
            <PopoverTrigger>
                <li className="text-white py-2 border-2 border-red-500 rounded-xl cursor-pointer text-center hover:bg-red-600 duration-500 px-16">Log Out</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-6">
                    <h1>Are you sure?</h1>
                    <button className="btn btn-error" onClick={logOut}>Yes</button>
                </div>
            </PopoverContent>
          </Popover>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold">{user?.displayName} Dashboard</h1>
      </div>
      <nav className="top-8 py-6 px-4 right-6 block md:hidden">
            <Popover>
                <PopoverTrigger>
                    <button className="btn btn-info">Menu</button>
                </PopoverTrigger>
                <PopoverContent>
                <ul className="mt-6 space-y-5 font-bold">
          <Popover>
            <PopoverTrigger>
            <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500 px-6">Create Community</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-5">
                    <Input required value={communityTitle} onChange={(e) => setCommunityTitle(e.target.value)} placeholder="Enter your community name"/>
                    <Textarea required value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} placeholder="What is your community about..."/>
                    <Input required value={communityType} onChange={(e) => setCommunityType(e.target.value)} placeholder="Community Type"/>
                    <Input required value={communityTarget} onChange={(e) => setCommunityTarget(e.target.value)} placeholder="What is your contribution goal" type="number"/>
        
                    <div className="flex justify-between px-3">
                    <button className="btn btn-success"onClick={createNewCommunity}>Submit</button>
                    <button className="btn btn-error" onClick={discard}>Cancel</button>
                    </div>
                </div>
            </PopoverContent>
          </Popover>
          <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500">See your Communities</li>
          <li>
          <Popover>
            <PopoverTrigger>
            <li className="text-white py-2 border-2 border-lime-100 rounded-xl cursor-pointer text-center hover:bg-lime-900 duration-500 px-14">User Details</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-6 overflow-hidden">
                    <img src={user?.photoURL} className="rounded-full h-20 w-20"/>
                    <h1>{user?.displayName}</h1>
                    <p className="text-sm">{user?.email}</p>
                </div>
            </PopoverContent>
          </Popover>
          </li>
          <li>
          <Popover>
            <PopoverTrigger>
                <li className="text-white py-2 border-2 border-red-500 rounded-xl cursor-pointer text-center hover:bg-red-600 duration-500 px-16">Log Out</li>
            </PopoverTrigger>
            <PopoverContent>
                <div className="block space-y-6">
                    <h1>Are you sure?</h1>
                    <button className="btn btn-error" onClick={logOut}>Yes</button>
                </div>
            </PopoverContent>
          </Popover>
          </li>
        </ul>
                </PopoverContent>
            </Popover>
        </nav>
        </div>
        <h1 className="text-center text-2xl font-bold mt-7">Your Communities</h1>
        </div>
    </div>
    )
}