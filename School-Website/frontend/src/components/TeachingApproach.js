import React from "react";

function TeachingApproach() {
  const approaches = [
    "Focus on holistic development—nurturing both academic and personal growth.",
    "Emphasis on STEM education with hands-on experiments and real-world applications.",
    "Integration of arts and creativity to encourage expression and imagination.",
    "Use of collaborative learning through group projects and peer interaction.",
    "Personalized guidance to support individual learning styles and strengths.",
    "Encouragement of critical thinking and problem-solving from early grades.",
    "Exposure to digital tools and modern technology in classrooms.",
    "Promotion of values and ethics alongside academic excellence.",
    "Regular assessments to track progress and provide constructive feedback.",
    "Supportive environment that builds confidence, curiosity, and leadership."
  ];

  return (
    <div className="flex flex-col items-start self-stretch my-auto w-full text-base font-extralight text-stone-300 max-md:mt-10 max-md:max-w-full">
      <h3 className="self-center ml-5 text-xl font-medium text-center text-black">
        Our Teaching Approach
      </h3>
      <ul className="self-stretch mt-4 space-y-3.5">
        {approaches.map((approach, index) => (
          <li key={index} className="flex items-start gap-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/55109cdc79e444868b7098cdc4cd42ee/4c4e002737805cdecfd58a3523b535d320d1fd07?placeholderIfAbsent=true"
              className="w-[15px] h-[15px] mt-1"
              alt="Bullet point"
            />
            <span className="flex-1 text-black">
              {approach}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TeachingApproach;