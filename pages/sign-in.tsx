import { parseCookies } from "nookies";
import React, { useContext, useState } from "react";

import Container from "../components/Container";
import Layout from "../components/Layout";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";
import Button from "../components/Button";
import { GetServerSideProps } from "next";

type FormValuesType = {
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

const SignIn = () => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useContext(AuthContext);

  const onSubmit = async (formValues: FormValuesType) => {
    const { email, password } = formValues;
    setError("");
    try {
      const res = await signIn(email, password);
      if (res.success === false) {
        console.log(res);
        setError(res.error.response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <Layout title="Sign In" description="login with your account now ">
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            })}
            errors={errors["password"]}
          />
          {error && <ErrorText>{error}</ErrorText>}
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

export default SignIn;
