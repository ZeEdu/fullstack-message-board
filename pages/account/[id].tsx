import { MongoClient, ObjectId } from "mongodb";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { getUserData, getUserMessages } from "../../dao";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import MessageList from "../../components/MessageList";
import { FindUser } from "../../interfaces/FindUser.interface";
import { Message } from "../../interfaces/Post.interface";

interface AccountProps {
  user: FindUser;
  messages: Message[];
}

const Account: FC<AccountProps> = ({ user, messages }) => {
  return (
    <Layout title="User Page" description="See this users messages">
      <Container>
        <MessageList initialMessages={messages} user={user} />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params["id"];
  try {
    const { _id, email, username } = await getUserData(
      "_id",
      new ObjectId(id.toString())
    );
    const messages = await getUserMessages("user_id", id.toString());
    return {
      props: {
        user: { _id: _id.toString(), username: username, email: email },
        messages: messages.map((message) => ({
          _id: message._id.toString(),
          email: message.email,
          username: message.username,
          user_id: message.user_id,
          message: message.message,
          likeCount: message.likeCount,
          likes: message.likes,
          createdAt: message.createdAt ? message.createdAt.toString() : null,
          updatedAt: message.updatedAt ? message.updatedAt.toString() : null,
        })),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

export default Account;
