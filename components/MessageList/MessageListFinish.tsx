import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 100%;
`;
const Text = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-align: center;
  color: #3b4252;
`;

const MessageListFinish = () => {
  return (
    <Wrapper>
      <Text>Nothing more to load</Text>
    </Wrapper>
  );
};

export default MessageListFinish;
