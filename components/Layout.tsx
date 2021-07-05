import Head from "next/head";
import React, { FC } from "react";
import MenuAppBar from "./MenuAppBar";
import Footer from "./Footer";
import styled from "styled-components";

const View = styled.div`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  min-height: 100vh;
`;

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
      <View>
        <MenuAppBar title={title} />
        <Body>{children}</Body>
        <Footer />
      </View>
    </>
  );
};

export default Layout;
