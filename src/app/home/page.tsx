"use client"
import Link from "next/link";
import { useState } from "react";

export default function homePage() {

    const [data, setData] = useState("");

    const userData = async () => {
        try {
          const res = await fetch("/api/me", {
            method: "GET",
            credentials: "include", // Cookies पठाउनलाई
          });
      
          const dataUser = await res.json(); // JSON मा convert गर्नु पर्छ
          console.log(dataUser);
          setData(dataUser.data._id); // _id Set गर्ने
        } catch (error) {
          console.error("Unable to fetch user data", error);
        }
      };
      


    return (
        <div className="bg-blue-200 h-screen">
            <div className="text-black">
                <p>Hello</p>
                <p className="text-black" >
                    {data === 'nothing' ? 'Nothing' : <Link href={`/home/${data}`}>{data}</Link>}
                </p>
            </div>
            <button className="bg-blue-900 rounded p-2" onClick={userData}>
                Get Data
            </button>
        </div>
    )
}