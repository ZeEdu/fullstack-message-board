import { parseCookies } from "nookies";
import React from "react";
import { GetServerSideProps } from "next";

import Layout from "../components/Layout";
import Container from "../components/Container";
import PageTitle from "../components/PageTitle";
import MessageForm from "../components/MessageForm";
import MessageList from "../components/MessageList";
import { getUserMessages } from "../dao/messages";
import { getSession } from "../dao/session";
import { Session } from "../interfaces/Session.interface";
import { User } from "../interfaces/User.interface";
import { getUser } from "../dao/users";
import { Message } from "../interfaces/Message.interface";

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
    const { ["messageboard.token"]: token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }

    const session: Session = await getSession("token", token);
    const user: User = await getUser("email", session.email);
    const messages: Message[] = await getUserMessages(
      "user_id",
      user._id.toString()
    );

    return {
      props: {
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        posts: messages.map((message) => ({
          _id: message._id.toString(),
          email: message.email,
          username: message.username,
          user_id: message.user_id,
          message: message.message,
          likeCount: message.likeCount,
          likes: message.likes,
          createdAt: message.createdAt ? message.createdAt.toString() : "",
          updatedAt: message.updatedAt ? message.updatedAt.toString() : "",
        })),
      },
    };
  } catch (error) {
    // console.error(error.response.data.message);
    return {
      props: {},
    };
  }
};

export default Profile;
