"use client";
import React from "react";
import { MainNav } from "../nav-menu";
import useGetPageTitle from "@/utils/hooks/useGetPageTitle";



const Header = () => {

  const {pageTitle}=useGetPageTitle();

  return (
    <header className="top-0 left-0 w-full h-[60px] z-[1] bg-[#2b99e9] mb-5 shadow-md flex items-center justify-between px-5 py-2 sticky">
      <span className="text-white text-xl font-oswald leading-[28px]">
        {pageTitle}
      </span>
      <MainNav/>
    </header>
  );
};

export default Header;
