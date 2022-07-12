import React, { CSSProperties } from "react";
import { NavBar } from "./NavBar";
import toast, { Toaster } from 'react-hot-toast';
import { CreateCSSProperties } from "@material-ui/styles";
import { Box } from "@material-ui/core";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar children={children} />
      <Toaster />
    </>
  );
};
