import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import GitHubIcon from "@material-ui/icons/GitHub";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";

function MenuComponent() {
  const useStyles = makeStyles(theme => ({
    title: {
      flexGrow: 1,
      marginTop: "initial",
      marginBottom: "initial",
    },
  }));
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar>
        {/*<IconButton edge="start" className={classes.menuButton} color="inherit" href="/">*/}
        {/*  <CodeIcon />*/}
        {/*</IconButton>*/}
        <Typography variant="h6" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            Flags Quiz
          </Link>
        </Typography>
        <Tooltip title="Go to main website">
          <IconButton aria-label="home" href="https://rubendougall.co.uk/" color="inherit">
            <HomeIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="GitHub repository">
          <IconButton aria-label="GitHub" href="https://github.com/Ruben9922/flags-quiz" color="inherit">
            <GitHubIcon/>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default MenuComponent;
