import React from "react";
import { HamburguerIcon } from "./icons/hamburguer";



const Header = () => {
  return (
    <header className="top-0 left-0 w-full h-[60px] bg-[#2b99e9] mb-5 shadow-md flex items-center justify-between px-5 py-2 sticky">
      <span className="text-white text-xl font-oswald leading-[28px]">
        EasyInventory
      </span>
      <HamburguerIcon />
    </header>
  );
};

export default Header;
