import React from "react";
import { Message } from "../../interfaces/Message.interface";

import MessageListItem from "./MessageListItem";
import styled from "styled-components";

const Section = styled.section``;

const Wrapper = styled.div`
  max-width: 100%;
`;
const Text = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-align: center;
  color: #3b4252;
`;

interface MessageListProps {
  posts: Message[];
  user?: any;
  isAuth?: any;
}

const MessageList: React.FC<MessageListProps> = ({ posts, user, isAuth }) => {
  if (!posts || posts.length === 0) {
    return (
      <Wrapper>
        <Text>Nothing more to load</Text>
      </Wrapper>
    );
  }

  return (
    <Section>
      {posts.map((post) => (
        <MessageListItem
          key={post._id.toString()}
          post={post}
          user={user}
          isAuth={isAuth}
        />
      ))}
    </Section>
  );
};

export default MessageList;
