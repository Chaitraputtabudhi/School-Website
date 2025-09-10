import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [openLogin, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    //check server session
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

  const handleLogout = async () => {
    try{
await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    }catch(err){
      console.log('Logout errpr',err);
    }
    
    setUser(null);
    localStorage.removeItem('user');//clear user
    navigate("/", { replace: true });
  };

  return (
    <header className="flex relative gap-5 justify-between items-center px-11 py-1.5 mb-0 w-full bg-cyan-950 max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
      <div className="flex gap-3.5 self-stretch my-auto text-2xl font-extrabold text-center text-white">
        <img
          src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/37f2d0d978645614dac293ad409c06f3afc1351b?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-start aspect-square w-[42px]"
          alt="School logo"
        />
        <h1>School name</h1>
      </div>

      <nav className="flex flex-wrap self-stretch text-xl font-semibold text-center text-white max-md:max-w-full">
        <div className="flex flex-wrap flex-auto gap-5 justify-center items-center px-2.5 py-5">
          <a href="/" className="self-stretch my-auto">Home</a>
          <a href="/about" className="self-stretch my-auto">About Us</a>
          <a href="/academics" className="self-stretch my-auto">Academics</a>
          <a href="#admissions" className="self-stretch my-auto">Admissions</a>
          <a href="#gallery" className="self-stretch my-auto">Gallery</a>
          <a href="#contact" className="self-stretch my-auto">Contact Us</a>
          <a href="#events" className="self-stretch my-auto">Latest Events</a>
        </div>
        <div className="flex flex-col justify-center px-1 py-2 my-auto bg-red-500 rounded-xl">
          <a href="#summer-camp">Summer Camp</a>
        </div>
      </nav>

      {/* If logged in → only Logout & Greeting */}
      <div className="flex gap-2.5 items-center self-stretch my-auto min-h-10">
        {user ? (
          <>
            <span className="text-white mr-3">Hi, {user.name}</span>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
        <>
            <img
              src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/a25a794fb4b50be4a6dcf138232021888696e3e2?placeholderIfAbsent=true"
              className="object-contain self-stretch my-auto w-8 aspect-square cursor-pointer"
              alt="Profile"
              onClick={() => setOpen(true)}
            />
            {openLogin && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg bg-opacity-50">
                  <div className="flex gap-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => { setOpen(false); navigate("/login"); }}
                    >
                      Sign-In
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => { setOpen(false); navigate("/signup"); }}
                    >
                      Sign-Up
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
    </header>
  );
}

export default Header;