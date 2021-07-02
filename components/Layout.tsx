import Head from "next/head";
import React, { FC } from "react";
import MenuAppBar from "./MenuAppBar";
import PropTypes from "prop-types";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const Layout: FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>Message Board | {title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar title={title} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
