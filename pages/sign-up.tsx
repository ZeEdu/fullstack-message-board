import React, { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";

import Container from "../components/Container";
import Layout from "../components/Layout";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import styled from "styled-components";

type formValuesType = {
  username: string;
  email: string;
  password: string;
};

const ErrorText = styled.p`
  color: #bf616a;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
`;

const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SignUpPage = () => {
  const router = useRouter();
  const [reqError, setReqError] = useState<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, signIn } = useContext(AuthContext);

  const onSubmit = async (formValues: formValuesType) => {
    const { username, email, password } = formValues;

    try {
      await signUp(username, email, password);
      await signIn(email, password);
    } catch (error) {
      setReqError("Something went Wrong. Please try again later");
      // console.error(error);
    }
  };

  return (
    <Layout title="Sign Up" description="Sign Up Page">
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            type="text"
            name="username"
            id="username"
            register={register("username", {
              required: {
                value: true,
                message: "Field is Required",
              },
              minLength: {
                value: 5,
                message: "Your username must have at least 5 characters",
              },
              maxLength: {
                value: 30,
                message: "Your username must have at max 30 characters",
              },
            })}
            errors={errors["username"]}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            register={register("email", {
              required: {
                value: true,
                message: "Field is Required",
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: "Email address is invalid",
              },
            })}
            errors={errors["email"]}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            register={register("password", {
              required: {
                value: true,
                message: "Field is Required",
              },
              minLength: {
                value: 6,
                message: "Your password must have at least 6 characters",
              },
              maxLength: {
                value: 30,
                message: "Your password must have at max 30 characters",
              },
            })}
            errors={errors["password"]}
          />
          {reqError && <ErrorText>{reqError}</ErrorText>}
          <ButtonHolder>
            <Button type="submit" value="Login" />
          </ButtonHolder>
        </form>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["messageboard.token"]: token } = parseCookies(ctx);
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignUpPage;
