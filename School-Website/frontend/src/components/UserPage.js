import React, { useEffect, useState } from "react";

function UserPage() {
    const [user, setUser] = useState(null);
    const [role, setrole] = useState('admin');

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

    const handleRole = async (e) =>{
        e.preventDefault();
        try{
            if(role === 'admin'){
                
            }
        }catch(err){}
    }


    return (
        <div className="flex overflow-hidden relative flex-col w-full min-h-[768px] pb-[694px] max-md:pb-24 max-md:max-w-full">
            <img
                src="/Images/School-Image.jpg"
                className="object-cover absolute inset-0 size-full"
                alt="School background"
            />
            <h1 className="relative z-10 text-3xl font-bold text-black mt-10 ml-5">
               Welcome {user?.emprole || "Guest"} </h1>
        </div>
    )
}

export default UserPage;