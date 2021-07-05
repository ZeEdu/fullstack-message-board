import React, { FC, useContext, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";
import Container from "./Container";
import NavLink from "./NavLink";
import StyledNavButton from "./StyledNavButton";

const Header = styled.div`
  width: 100%;
`;

interface MenuAppBarProps {
  title: string;
}

const Navigation = styled.nav`
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e3440;
`;

const MenuAppBar: FC<MenuAppBarProps> = ({ title }) => {
  const { user, logOut } = useContext(AuthContext);

  const handleClick = async () => {
    await logOut();
  };

  return (
    <Header>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>{title}</Title>
          <Navigation>
            {user ? (
              <>
                <NavLink href="/" name="Home" />
                <NavLink href="/profile" name="Profile" />
                <StyledNavButton value="Log Out" onClick={handleClick} />
              </>
            ) : (
              <>
                <NavLink href="/" name="Home" />
                <NavLink href="/sign-in" name="Sign In" />
                <NavLink href="/sign-up" name="Sign Up" />
              </>
            )}
          </Navigation>
        </div>
      </Container>
    </Header>
  );
};
export default MenuAppBar;
