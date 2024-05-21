"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/firebase/config"
import { collection, getDocs } from "firebase/firestore";
import {useState, useEffect} from "react"

export default function AllCommunities(){

    const [communities, setCommunities] = useState([]);

    const getAllCommunitites = async () => {
        const querySnapshot = await getDocs(collection(db, "communities"));

        const newCommunity = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        setCommunities(newCommunity);
    }

    useEffect(() => {
        getAllCommunitites();
    },[])

    return(
        <div className="min-h-screen w-full p-3">
            <h1 className="text-5xl font-bold text-pink-300 text-center mt-4">Our Trusted Communities 🌸</h1>
            <div className="grid md:grid-cols-3 gap-5 grid-cols-1 space-y-5 md:ml-4 mt-10">
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
                        <p className="text-lg text-green-300 font-bold">Created By: {c.createdBy}</p>
                        <button className="btn btn-success">Donate 🪙</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    )
}