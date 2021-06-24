import { parseCookies } from "nookies";
import React from "react";

import Layout from "../components/Layout";
import MessageForm from "../components/MessageForm";

const Message = () => {
  return (
    <Layout
      title="Write a Message"
      description="Share your thoughts with the world "
    >
      <main>
        <h1>Write a Message</h1>
        <MessageForm />
      </main>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { ["messageboard.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Message;
