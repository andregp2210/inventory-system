"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "../constants";

const useGetPageTitle = () => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("EasyInventory");

  useEffect(() => {
    let pageTitle = "Sistema de Inventario";

    switch (pathname) {
      case "/categories":
        pageTitle = MENU_ITEMS[1];
        break;
      case "/dashboard":
        pageTitle = MENU_ITEMS[3];
        break;
      case "/kardex":
        pageTitle = MENU_ITEMS[2];
        break;
      case "/products":
        pageTitle = MENU_ITEMS[0];
        break;
      default:
        pageTitle;
    }

    setPageTitle(pageTitle);
  }, [pathname]);

  return { pageTitle };
};

export default useGetPageTitle;
