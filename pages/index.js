import { useRouter } from "next/router";
import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { push } = useRouter();

  const handleClick = () => {
    push("/message");
  };

  return (
    <Layout title="Home" description="Message Board Home Page">
      {isAuthenticated && (
        <button type="button" onClick={handleClick}>
          Write a Message
        </button>
      )}
      <p>Hello World Home Page</p>
    </Layout>
  );
}
