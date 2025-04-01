import olx from "../assets/olx.png";
import lens from "../assets/lens.png";
import arrow from "../assets/arrow.png";
import Login from "./Login";
import { useState } from "react";

export default function Navbar() {
  const [loginPop, setLoginPop] = useState(false);

  return (
    <>
      <div className="flex items-center p-4 bg-white shadow-md">
        {/* OLX Logo */}
        <img src={olx} alt="OLX Logo" className="w-11 h-9 object-contain" />

        {/* Location Search Input */}
        <div className="flex border-2 items-center  border-gray-400 rounded-md px-3 py-2 ml-5 w-64">
          <img
            src={lens}
            alt="Lens Icon"
            className="w-5 h-5 text-gray-500 object-contain"
          />
          <input
            placeholder="India"
            className="ml-2 w-full outline-none text-gray-700"
          />
          <img
            src={arrow}
            alt="Dropdown Arrow"
            className="w-4 h-4 text-gray-500"
          />
        </div>

        {/* Product Search Input */}
        <div className="flex items-center border border-gray-400 rounded-md px-3 py-2 ml-4 flex-1 relative">
          <input
            placeholder="Search Cars, Mobile phones and more"
            className="w-full outline-none text-gray-700"
          />
          <button className="absolute right-0 p-2 rounded-md">
            <img
              src={lens}
              alt="Search Icon"
              className="w-6 h-6 object-contain"
            />
          </button>
        </div>

        {/* Language Section */}
        <div className="flex items-center ml-6 cursor-pointer">
          <h1 className="font-semibold text-gray-700">ENGLISH</h1>
          <img src={arrow} alt="Dropdown Arrow" className="w-4 h-4 ml-2" />
        </div>

        {/* Login Section */}
        <div
          onClick={() => setLoginPop(!loginPop)}
          className="ml-6 cursor-pointer"
        >
          <h1 className="font-bold text-gray-700 underline hover:no-underline">
            Login
          </h1>
        </div>

        {/* + SELL Button */}
        <div className="ml-6 flex items-center justify-center px-4 py-2 rounded-full border-2 border-gray-200 bg-white relative">
          <div className="absolute inset-0 border-2 border-yellow-400 rounded-full"></div>
          <h1 className="font-bold text-lg relative z-10 text-gray-900">
            + SELL
          </h1>
        </div>
      </div>

      {loginPop && <Login></Login>}
    </>
  );
}
