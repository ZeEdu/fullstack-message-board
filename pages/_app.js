import Head from "next/head";
import { AuthProvider } from "../contexts/AuthContext";
import GlobalStyle from "../styles/Global";

const theme = {
  colors: {
    primary: "#88C0D0",
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
