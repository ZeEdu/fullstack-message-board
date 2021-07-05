import React from "react";
import { FC } from "react";
import moment from "moment";

import { useState } from "react";
import styled from "styled-components";
import { Message } from "../../interfaces/Message.interface";
import { api } from "../../services/api";
import Anchor from "../Anchor";

const Article = styled.article`
  font-family: "Roboto", sans-serif;
  margin-bottom: 2rem;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
`;
const Date = styled.span`
  color: #88c0d0;
`;
const MessageBody = styled.div`
  margin-bottom: 0.75rem;
`;
const Text = styled.p`
  color: #2e3440;
`;
const LikeBox = styled.div``;
const LikeButton = styled.button`
  margin-right: 0.75rem;
  font-size: 1rem;
  background: none;
  border: 2px solid #3b4252;
  border-radius: 0.3125rem;
  color: #3b4252;
  cursor: pointer;
  padding: 0.5rem;
  transition: 0.3s;
  &:hover {
    border-color: #81a1c1;
    color: #81a1c1;
  }
`;
const LikeCount = styled.span`
  color: #88c0d0;
`;

interface MessageListItemProps {
  post: Message;
  user?: any;
  isAuth?: any;
}

const MessageListItem: FC<MessageListItemProps> = ({ post, user, isAuth }) => {
  const [localPost, setLocalPost] = useState(post);

  const canLike = (): boolean => {
    if (!isAuth) return false;

    if (!user) return false;
    if (user._id === localPost.user_id) return false;
    if (localPost.likes.includes(user._id.toString())) return false;

    return true;
  };

  const canDislike = (): boolean => {
    if (!isAuth) return false;
    if (!user) return false;
    if (user._id === localPost.user_id) return false;
    if (localPost.likes.includes(user._id.toString())) return true;

    return false;
  };

  const dislike = async (): Promise<void> => {
    if (canDislike() === false) return;

    const body = {
      user_id: user._id,
      post_id: post._id,
    };

    try {
      const { data } = await api.put("/posts/dislike", body);
      setLocalPost(data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const like = async (): Promise<void> => {
    if (canLike() === false) return;

    const body = {
      user_id: user._id,
      post_id: post._id,
    };

    try {
      const { data } = await api.put("/posts/like", body);
      setLocalPost(data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Article>
      <Heading>
        <Anchor
          href={`/account/${localPost.user_id}`}
          name={localPost.username}
        />
        <Date>{moment(localPost.createdAt).fromNow()}</Date>
      </Heading>
      <MessageBody>
        <Text>{localPost.message}</Text>
      </MessageBody>
      <LikeBox>
        {canLike() && (
          <LikeButton type="button" onClick={like}>
            Like
          </LikeButton>
        )}
        {canDislike() && (
          <LikeButton type="button" onClick={dislike}>
            Unlike
          </LikeButton>
        )}
        <LikeCount>{localPost.likeCount} likes</LikeCount>
      </LikeBox>
    </Article>
  );
};

export default MessageListItem;
