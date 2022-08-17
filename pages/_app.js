import "../styles/globals.css";
import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/mui_config/theme";
import createEmotionCache from "../src/mui_config/createEmotionCache";
import Layout from "../src/components/Layout";
import { Toaster } from "react-hot-toast";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Blog App Project" />
        <link rel="icon" href="./assets/images/SUSLU.png" />
        <title>SUSLU Blog App</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        </StyledEngineProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
