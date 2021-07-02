import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
  color: #2e3440;
  padding: 1rem 0;
`;

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return <Title>{title}</Title>;
};

export default PageTitle;
