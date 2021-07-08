import React, { FC, useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";
import Layout from "../components/Layout";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import PageTitle from "../components/PageTitle";
import { GetStaticProps } from "next";
import Container from "../components/Container";

import { Message } from "../interfaces/Message.interface";
import { getAllMessages } from "../dao/messages";

interface HomeProps {
  messages: Message[];
}

const Home: FC<HomeProps> = ({ messages }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Layout title="Home" description="Message Board Home Page">
      <Container>
        {isAuthenticated && <MessageForm />}
        <PageTitle title="Recent Messages" />
        <MessageList
          initialMessages={messages}
          user={user}
          isAuth={isAuthenticated}
        />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetStaticProps = async (ctx) => {
  try {
    const messages = await getAllMessages();
    return {
      props: {
        messages: messages.map(
          ({
            _id,
            email,
            username,
            user_id,
            message,
            likeCount,
            likes,
            createdAt,
            updatedAt,
          }) => ({
            _id: _id.toString(),
            email: email,
            username: username,
            user_id: user_id,
            message: message,
            likeCount: likeCount,
            likes: likes,
            createdAt: createdAt ? createdAt.toString() : "",
            updatedAt: updatedAt ? updatedAt.toString() : "",
          })
        ),
      },
    };
  } catch (error) {
    // console.error(error);
    return {
      props: {},
    };
  }
};

export default Home;
