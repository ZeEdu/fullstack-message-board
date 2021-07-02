import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const StyledAnchor = styled.a`
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  color: #2e3440;
  border-bottom: 1px solid transparent;
  transition: 0.3s;
  &:hover,
  &:focus {
    border-bottom: 1px solid #88c0d0;
    border-color: #88c0d0;
    color: #88c0d0;
  }
`;

interface AnchorProps {
  href: string;
  name: string;
}

const Anchor: FC<AnchorProps> = ({ href, name }) => {
  return (
    <Link href={href} passHref>
      <StyledAnchor>{name}</StyledAnchor>
    </Link>
  );
};

export default Anchor;
