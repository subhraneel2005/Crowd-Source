"use client"

import { auth } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {useState, useEffect} from "react"
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
    const [communityImg, setCommunityImg] = useState("");
    const [communityTarget, setCommunityTarget] = useState(null);
    const [communityType, setCommunityType] = useState("");
    const [communityDonators, setCommunityDonators] = useState([]);
    const [communityStatus, setCommunityStatus] = useState("");
    const [upiId, setUpiId] = useState("");
    const [communities, setCommunities] = useState([]);

    const createNewCommunity = async(e) => {
        e.preventDefault();

        if(!communityTitle || !communityDescription || !communityTarget || !communityType){
            alert("Please fill in all fields");
        }

        else{
            let imgUrl = "";


        const newCommunity = {
            title: communityTitle,
            description: communityDescription,
            target: communityTarget,
            type: communityType,
            createdAt: currentDate,
            donators: communityDonators,
            img: communityImg,
            createdBy: user?.email,
            comId: Math.random().toString(36).substring(2),
            upiId: upiId,
        }

        communities.push(newCommunity);

        try {
            await addDoc(collection(db, "communities"), newCommunity);
            alert("Community created successfully");
            setCommunityTitle("");
            setCommunityDescription("");
            setCommunityTarget("");
            setCommunityType("");
            setUpiId("")
            setCommunityImg("")
            // setCommunityImg(null);
        } catch (error) {
            console.log(error);
        }
        setCommunities(communities);
        }
    }

    const discard = () => {
        setCommunityTitle("");
        setCommunityDescription("");
        setCommunityTarget("");
        setCommunityType("");
        setCommunityImg("");
    }

    const getCurrentUsersCommunity = async() => {
        if(!user){
            return <h1>Loading...</h1>
        }
        const q = query(collection(db,"communities"),where("createdBy","==",user?.email));

        try {
            const querySnapshot = await getDocs(q);
            const newCommunities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
            setCommunities(newCommunities);
        } catch (error) {
            console.log(error);
        }  
    }

    const deleteCommunity = async (community) => {
        try {
            console.log("Deleting community:", community);
    
            // Find the document ID associated with the task
            const querySnapshot = await getDocs(collection(db, "communities"));
            const comDOc = querySnapshot.docs.find(doc => doc.data().title === community.title && doc.data().createdBy === community.createdBy);
            const comId = comDOc?.id;
    
            if (!comId) {
                console.error("Community not found in Firestore");
                return;
            }
    
            // Deleting the task from Firestore
            await deleteDoc(doc(db, "communities", comId));
    
            // If the deletion is successful, update the local state
            const updatedCommunities = communities.filter(c => c.comId !== community.comId);
            setCommunities(updatedCommunities);
        } catch (error) {
            console.error("Error deleting community: ", error);
        }
    };

    useEffect(() => {
        getCurrentUsersCommunity();
    },[])

    

    if(!user){
        router.push("/auth");
    }

    return(
    <div className="min-h-screen w-full flex">
        <div className="flex justify-between">
        <div className="bg-gradient-to-r from-lime-600 to-yellow-600 w-64 h-screen p-4 hidden md:block">
        <ul className="mt-2 space-y-5 font-bold">
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
                    <Input required value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter your UPI id to get future donations"/>
                    <Input value={communityImg} onChange={(e) => setCommunityImg(e.target.value)} placeholder="Communities Image"/>
        
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
        <div className="block space-y-7">
            <h1 className="text-3xl font-bold">{user?.displayName} Dashboard</h1>
            <h1 className="text-center text-2xl font-bold">Your Communities</h1>
                {communities.length === 0 ? (<h1>Start by publishing your first community to the public!</h1>) : (
            <div className="grid md:grid-cols-2 gap-14 grid-cols-1 space-y-5 md:ml-4 mt-10">
                {communities.map((c) => (
                    <div key={c.title} className="card w-80 md:w-96  bg-base-100 shadow-xl">
                    <figure><img src={c.img} className="w-full p-3" alt="Banner Image" /></figure>
                    <div className="card-body">
                      <h2 className="card-title">
                        {c.title}
                        <div className="badge badge-secondary">{c.type}</div>
                      </h2>
                      <p>{c.description}</p>
                      <div className="card-actions justify-end">
                        <p className="text-lg text-green-300 font-bold">Target: Rs {c.target}</p>
                        <p className="text-lg text-sky-300 font-bold">UPI Id: {c.upiId}</p>
                        <Popover>
                            <PopoverTrigger>
                            <button className="btn btn-warning">Delete</button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="block space-y-5">
                                    <h1>Warning! This action is not reversible</h1>
                                    <button className="btn btn-error" onClick={() => deleteCommunity(c)}>I understand, delete this community</button>
                                </div>
                            </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
            </div>)}
        </div>
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
                    <Input required value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter your UPI id to get future donations"/>
                    <Input value={communityImg} onChange={(e) => setCommunityImg(e.target.value)} placeholder="Communities Image"/>
        
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
        </div>
    )
}