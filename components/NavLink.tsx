import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const Anchor = styled.a`
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  color: #2e3440;
  padding: 0.75rem;
  border: 3px solid white;
  border-radius: 0.3125rem;
  transition: 0.3s;
  &:hover,
  &:focus {
    border-color: #88c0d0;
    color: #88c0d0;
  }
`;

interface NavLinkProps {
  href: string;
  name: string;
}

const NavLink: FC<NavLinkProps> = ({ href, name }) => {
  return (
    <Link href={href} passHref>
      <Anchor>{name}</Anchor>
    </Link>
  );
};

export default NavLink;
