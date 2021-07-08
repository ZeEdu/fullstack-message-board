import React, { FC, useState } from "react";
import { User } from "../../interfaces/User.interface";
import { Message } from "../../interfaces/Message.interface";
import { api } from "../../services/api";
import Button from "../Button";
import MessageList from "./MessageList";
import MessageListFinish from "./MessageListFinish";

interface MessageListProps {
  user?: User;
  initialMessages: Message[];
  isAuth?: boolean;
}

const Index: FC<MessageListProps> = ({ user, initialMessages, isAuth }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pagePosts, setPagePosts] = useState<Message[]>(initialMessages);
  const [end, setEnd] = useState<boolean>(false);
  let page = 0;

  const loadMore = async () => {
    const url = `/posts/?id=${user ? user._id.toString() : ""}&page=${
      page + 1
    }`;
    try {
      setLoading(true);
      const {
        data: { result },
      } = await api.get(url);
      setPagePosts((curr) => [...curr, ...result]);
      if (result.length < 10) {
        setEnd(true);
      }
      page = page + 1;
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MessageList posts={pagePosts} user={user} isAuth={isAuth} />
      {pagePosts && pagePosts.length >= 10 && !end && (
        <Button
          type="button"
          value={loading ? "Loading more messages" : "Load More"}
          onClickAction={loadMore}
          disabled={loading}
          expand
        />
      )}
      {end && <MessageListFinish />}
    </>
  );
};

export default Index;
