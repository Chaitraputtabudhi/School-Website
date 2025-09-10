import React, { useEffect, useState } from "react";
import Header from "./Header";

function UserPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        const checkSession = async () => {
            try {
                const res = await fetch("http://localhost:5000/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.log("No active session");
            }
        };
        checkSession();
    }, []);
    return (
        <section className="flex overflow-hidden relative flex-col w-full min-h-[768px] pb-[694px] max-md:pb-24 max-md:max-w-full">
            <img
                src="/Images/School-Image.jpg"
                className="object-cover absolute inset-0 size-full"
                alt="School background"
            />
            <Header />
            <h1 className="relative z-10 text-3xl font-bold text-black mt-10 ml-5">
               Welcome {user?.name || "Guest"} </h1>
        </section>
    )
}

export default UserPage;