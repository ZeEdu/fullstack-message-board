import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import React, { FC } from "react";

import Container from "../../components/Container";
import Layout from "../../components/Layout";
import MessageList from "../../components/MessageList";
import { User } from "../../interfaces/User.interface";
import { Message } from "../../interfaces/Message.interface";
import { getUser } from "../../dao/users";
import { getUserMessages } from "../../dao/messages";

interface AccountProps {
  user: User;
  messages: Message[];
}

const Account: FC<AccountProps> = ({ user, messages }) => {
  // console.log(messages);

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
    const { _id, email, username }: User = await getUser(
      "_id",
      new ObjectId(id.toString())
    );

    const messages: Message[] = await getUserMessages("user_id", id.toString());

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
