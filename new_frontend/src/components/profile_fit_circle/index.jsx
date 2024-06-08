import React from "react";

const Circle = ({src}) => {
  return (
    <>
      <div className="border-2 border-white mx-auto w-72 h-72 overflow-hidden shadow-sm rounded-full">
        <img src={src} className="w-full h-full object-cover"/>
      </div>
    </>
  );
};

export default Circle;