import olx from "../assets/olx.png";
import lens from "../assets/lens.png";
import arrow from "../assets/arrow.png";
import Login from "./Login";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [loginPop, setLoginPop] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSellClick = () => {
    if (!user) {
      toast.error("Please login to sell products!");
      setLoginPop(true);
      return;
    }
    navigate("/addProduct");
  };

  const handleLogoClick = () => {
    navigate("/");
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <>
      <div className="flex items-center p-4 bg-slate-100 shadow-md ">
        {/* OLX Logo */}
        <img
          src={olx}
          alt="OLX Logo"
          className="w-11 h-9 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        />

        {/* Location Search Input */}
        <div className="flex border-2 items-center bg-white  border-gray-400 rounded-md px-3 py-2 ml-5 w-64">
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
        <form className="flex bg-white items-center border border-gray-400 rounded-md px-3 py-2 ml-4 flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Cars, Mobile phones and more"
            className="w-full outline-none text-gray-700"
          />
          <div className="absolute right-0 p-2 rounded-md cursor-not-allowed opacity-50">
            <img
              src={lens}
              alt="Search Icon"
              className="w-6 h-6 object-contain"
            />
          </div>
        </form>

        {/* Language Section */}
        <div className="flex items-center ml-6 cursor-pointer">
          <h1 className="font-semibold text-gray-700">ENGLISH</h1>
          <img src={arrow} alt="Dropdown Arrow" className="w-4 h-4 ml-2" />
        </div>

        {/* login logout section  */}
        {user ? (
          <div className="flex items-center ml-6 gap-4 cursor-pointer">
            <span className="font-semibold text-gray-700">
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="font-bold text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        ) : (
          <div
            onClick={() => setLoginPop(!loginPop)}
            className="ml-6 cursor-pointer"
          >
            <h1 className="font-bold text-gray-700 underline hover:no-underline">
              Login
            </h1>
          </div>
        )}

        <div
          onClick={handleSellClick}
          className="ml-6 flex items-center justify-center px-4 py-2 rounded-full border-2 border-gray-200 bg-white relative cursor-pointer hover:bg-gray-50"
        >
          <div className="absolute inset-0 border-2 border-yellow-400 rounded-full"></div>
          <h1 className="font-bold text-lg relative z-10 text-gray-900">
            + SELL
          </h1>
        </div>
      </div>

      {loginPop && <Login setLoginPop={setLoginPop}></Login>}
    </>
  );
}
