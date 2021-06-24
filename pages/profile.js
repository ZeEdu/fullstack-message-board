import { parseCookies } from "nookies";
import React from "react";
import Layout from "../components/Layout";
import { GetApiClient } from "../services/axios";

const Profile = ({ username, email }) => {
  return (
    <Layout title="Profile" description="View your own posts">
      <h1>
        This is the profile page, {username && username} ({email && email})
      </h1>
      <p>Where you can view your own posts</p>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const apiClient = GetApiClient(ctx);

  const { ["messageboard.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  // const res = recoverUserInformation();
  const {
    data: { type, user },
  } = await apiClient.get("/user");

  if (type === "success") {
    return {
      props: { ...user },
    };
  }

  return {
    props: {},
  };
};

export default Profile;
