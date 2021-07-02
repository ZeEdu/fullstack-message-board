import { parseCookies } from "nookies";
import React from "react";
import { GetServerSideProps } from "next";

import Layout from "../components/Layout";
import Container from "../components/Container";
import { GetApiClient } from "../services/axios";
import PageTitle from "../components/PageTitle";
import MessageForm from "../components/MessageForm";
import MessageList from "../components/MessageList";

const Profile = ({ user, posts }) => {
  return (
    <Layout title="Profile" description="View your own posts">
      <Container>
        <MessageForm />
        <PageTitle title="Your Messages" />
        <MessageList user={user} initialMessages={posts} />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = GetApiClient(ctx);

    const { ["messageboard.token"]: token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }

    const {
      data: { user },
    } = await apiClient.get("/user");
    const {
      data: { result: posts },
    } = await apiClient.get(`/posts/?id=${user._id.toString()}&page=0`);

    return {
      props: { user, posts },
    };
  } catch (error) {
    console.error(error.response.data.message);
    return {
      props: {},
    };
  }
};

export default Profile;
