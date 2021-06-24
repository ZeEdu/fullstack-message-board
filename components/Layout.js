import Head from "next/head";
import React from "react";
import MenuAppBar from "./MenuAppBar";
import PropTypes from "prop-types";

const Layout = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>Message Board | {title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar title={title} />
      {children}
    </>
  );
};

Layout.propType = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.element,
};

export default Layout;
