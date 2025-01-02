"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useGetPageTitle = () => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("EasyInventory");

  useEffect(() => {
    let pageTitle = "EasyInventory";

    switch (pathname) {
      case "/categories":
        pageTitle = "Categories";
        break;
      case "/dashboard":
        pageTitle = "Dashboard";
        break;
      case "/kardex":
        pageTitle = "Kardex";
        break;
      case "/products":
        pageTitle = "Products";
        break;
      default:
        pageTitle;
    }

    setPageTitle(pageTitle);
  }, [pathname]);

  return { pageTitle };
};

export default useGetPageTitle;
