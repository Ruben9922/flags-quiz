import React from 'react';
import AppBarComponent from "./AppBarComponent";
import QuizComponent from "./QuizComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import { useFetch } from "use-http";
import {SnackbarProvider} from "notistack";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {
  const classes = useStyles();

  const { loading, error, data = null } = useFetch("https://restcountries.eu/rest/v2/all?fields=name;alpha2Code", {}, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      autoHideDuration={1500}
    >
      <AppBarComponent />
      {error && (
        <Container maxWidth="md" style={{marginTop: "5em"}}>
          <Alert severity="error" elevation={6} variant="filled">
            <AlertTitle>Error</AlertTitle>
            Failed to load country/territory data.
          </Alert>
        </Container>
      )}
      {loading && (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {data && <QuizComponent countries={data} />}
    </SnackbarProvider>
  );
}

export default App;
