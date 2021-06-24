import { parseCookies } from "nookies";
import React, { useContext, useState } from "react";

import Layout from "../components/Layout";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthContext";

const SignIn = () => {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useContext(AuthContext);

  const onSubmit = async (formValues) => {
    const { email, password } = formValues;

    setError("");

    try {
      const stmSignIn = await signIn(email, password);
      if (stmSignIn.success === false) {
        setError("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Sign In" description="login with your account now ">
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
        <input type="submit" value="Login" />

        <div>{error && error}</div>
      </form>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { ["messageboard.token"]: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignIn;
