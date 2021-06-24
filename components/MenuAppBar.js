import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 12px;
`;

const Header = styled.div`
  width: 100%;
  border: 1px solid black;
`;

export default function MenuAppBar({ title }) {
  const { user } = useContext(AuthContext);

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
          <h1>{title}</h1>
          <nav>
            {user ? (
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <button type="button">Exit</button>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/sign-in">Sign In</Link>
                </li>
                <li>
                  <Link href="/sign-up">Sign Up</Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </Container>
    </Header>
  );
}
