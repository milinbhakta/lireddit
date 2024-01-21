import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "../styles/main.css";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const theme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#2196F3", // green
        light: "#BBDEFB",
        dark: "#1976D2",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#8BC34A", // yellow
      },
      text: {
        primary: "#FFF",
        secondary: "#757575",
      },
      divider: "#BDBDBD",
    },
    typography: {
      fontFamily: ["barlow", "sans-serif"].join(","),
    },
  });

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Lireddit</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=barlow:100,400,500,500i,600,600i,700"
          rel="stylesheet"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}
