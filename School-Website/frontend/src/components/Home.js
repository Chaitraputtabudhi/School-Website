import React from "react";
import Header from "./Header";

function Home(){
     return (
    <section className="flex overflow-hidden relative flex-col w-full min-h-[768px] pb-[694px] max-md:pb-24 max-md:max-w-full">
      <img
        src="/Images/School-Image.jpg"
        className="object-cover absolute inset-0 size-full"
        alt="School background"
      />
      <Header />
    </section>
  )
}

export default Home;