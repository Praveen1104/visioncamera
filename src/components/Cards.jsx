import React from "react";
import X from "../assets/x.svg";

function Cards({ cardData }) {
  console.log(cardData);
  return (
    <>
      {cardData?.map((data, key) => (
        <div
          key={key}
          className="flex flex-wrap flex-row border-[--border-color] border bg-[#ffffff] bg-opacity-10 backdrop-blur-md w-full items-center justify-center  px-10 h-72 rounded-xl max-md:h-full"
        >
          <div className="flex flex-row relative w-full items-center justify-between h-full">
            <div className="w-full top-10 h-full left-0 md:left-4 p-2 px-0 md:p-4 text-left text-white flex flex-col justify-evenly">
              <h2 className="text-5xl w-full font-bold max-md:text-3xl max-md:text-center">
                {data.title}
              </h2>
              <p className="mt-2 w-full max-md:text-center text-3xl font-normal max-md:text-xl">
                {data.subTitle} : {data.totalKit}
              </p>
            </div>
            <img
              className="absolute right-0 -z-10 flex h-full"
              src={X}
              alt="Quantum Vision X"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default Cards;
