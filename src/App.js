import React from 'react';
import AppBarComponent from "./AppBarComponent";
import QuizComponent from "./QuizComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {withStyles} from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://restcountries.eu/rest/v2/all?fields=name;alpha2Code")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const {classes} = this.props;
    const {error, isLoaded, items} = this.state;

    let content;
    if (error) {
      content =
        <Container maxWidth="md" style={{marginTop: "5em"}}>
          <Alert severity="error" elevation={6} variant="filled">
            <AlertTitle>Error</AlertTitle>
            Failed to load country/territory data.
          </Alert>
        </Container>;
    } else if (!isLoaded) {
      content =
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit"/>
        </Backdrop>
    } else {
      content = <QuizComponent countries={items}/>;
    }

    return (
      <>
        <AppBarComponent/>,
        {content}
      </>
    );
  }
}

export default withStyles(styles)(App);
