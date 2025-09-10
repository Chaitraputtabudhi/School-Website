import React from "react";
import Header from "./Header";

function Aboutus() {
  return (
    <div>
    <Header />
    <section className="flex overflow-hidden flex-col items-center px-20 py-40 w-full bg-white max-md:px-5 max-md:py-24 max-md:max-w-full">
      
      <h2 className="text-2xl text-center text-black">
        "Shaping Bright Futures Since 1990"
      </h2>
      <p className="mt-2 text-base text-center text-black">
        A place where curiosity meets knowledge.
      </p>
      <div className="self-end mt-12 mb-0 w-full max-w-[1210px] max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-6/12 max-md:ml-0 max-md:w-full">
            <div className="self-stretch my-auto max-md:mt-10 max-md:max-w-full">
              <h3 className="text-2xl text-black max-md:mr-1 max-md:max-w-full">
                Learn More About Our Work And Our Cultural Activities
              </h3>
              <p className="mt-14 text-base text-black max-md:mt-10 max-md:max-w-full ">
                At XYZ School, we follow the International Montessori Method,
                which emphasizes hands-on, child-centered learning. Our approach
                encourages children to learn at their own pace, fostering
                independence, curiosity, and a lifelong love for learning. By
                providing an environment rich in educational materials and
                guided by experienced educators, we support the holistic
                development of every child.
              </p>
            </div>
          </div>
          <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/8621d4260db04ecbcad7e858ed8cc91e3e79e92f?placeholderIfAbsent=true"
              className="object-contain grow w-full aspect-[1.39] max-md:mt-10 max-md:max-w-full"
              alt="School activities"
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

export default Aboutus;