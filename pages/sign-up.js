import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signUp, signIn } = useContext(AuthContext);

  const onSubmit = async (formValues) => {
    try {
      const res = await signUp(
        formValues.username,
        formValues.email,
        formValues.password
      );

      if (res.success === true) {
        router.push("/sign-in");

        // const signinStm = await signIn(formValues.email, formValues.password);
        // console.log(signinStm);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title="Sign Up" description="Sign Up Page">
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
        <input type="submit" value="Login" />
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

export default SignUpPage;
