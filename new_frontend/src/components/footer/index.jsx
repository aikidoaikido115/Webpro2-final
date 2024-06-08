import React from "react";


function Footer (){
  return (
    <footer className="bg-gray-100 w-full">
      <div className="flex justify-center items-center h-20 px-4">
        <div className="text-gray-500 text-sm text-center">
          <div className=" mb-4">
              นโยบาย
            <span className="mx-2">|</span>
              เกี่ยวกับเรา
            <span className="mx-2">|</span>
              ติดต่อ
              <span className="mx-2">|</span>
              ช่วยเหลือ
          </div>
          <p className="text-gray-500">
            Copyright © 2024 AC-ED. All Rights Reserved.
          </p>
          <div>

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;