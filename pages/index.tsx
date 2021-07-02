import React, { useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";
import Layout from "../components/Layout";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import PageTitle from "../components/PageTitle";
import { GetStaticProps } from "next";
import Container from "../components/Container";

export default function Home({ posts }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Layout title="Home" description="Message Board Home Page">
      <Container>
        {isAuthenticated && <MessageForm />}
        <PageTitle title="Recent Messages" />
        <MessageList
          initialMessages={posts}
          user={user}
          isAuth={isAuthenticated}
        />
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetStaticProps = async (ctx) => {
  try {
    const {
      data: { result: posts },
    } = await api.get(`/posts/?id=&page=0`);
    return {
      props: { posts },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
