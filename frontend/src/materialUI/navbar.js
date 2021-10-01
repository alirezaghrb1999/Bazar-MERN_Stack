import React, { useContext } from 'react';
import './drawer.css'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth-context';
import LogReg from './logreg';
import Profile from './profile';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MyNavbar = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  const logoutHandler = () => {
    auth.logout();
  }

  const userprofile = (
    <div className={classes.title}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Profile image={auth.photo}/>
        <Typography variant="h7" component="h3" style={{ margin: "20px 10px" }}>
          Welcome {auth.name}
        </Typography>
      </div>
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className="Login">
          <IconButton onClick={() => props.changesituation(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {auth.token ?
            userprofile :
            <Typography variant="h6" className={classes.title}>
              BAZAR
            </Typography>
          }
          {auth.token ?
            <Link to="/">
              <Button onClick={logoutHandler} color="inherit">Logout</Button>
            </Link>
            : <LogReg />
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MyNavbar;