import React from "react";
import TeachingApproach from "./TeachingApproach";
import Header from "./Header";

function Academics() {
  return (
    <div>
      <Header />
      <section className="flex overflow-hidden flex-col items-center px-20 pt-12 pb-52 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <h2 className="text-2xl text-center text-black">Academics</h2>
        <p className="mt-4 text-base text-center text-black">
          Explore our curriculum, departments, and learning philosophy
        </p>
        <div className="self-stretch mt-7 mb-0 max-md:mb-2.5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-6/12 max-md:ml-0 max-md:w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/7eab2d02b6dc533c5a943bf2862cdf49351eb5a6?placeholderIfAbsent=true"
                className="object-contain grow w-full aspect-[1.29] max-md:mt-10 max-md:max-w-full"
                alt="Teaching approach"
              />
            </div>
            <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <TeachingApproach />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Academics;