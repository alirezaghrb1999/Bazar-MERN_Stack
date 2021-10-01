import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{margin:"100px"}}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Bazar
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'a simple trade app that people can sell and buy essential items '}
          {'which helps people do it faster than before :)'}
        </Typography>
        <Typography variant="body1">designed by Alireza Ghorbani.</Typography>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">trade and find your items in Bazar</Typography>
        </Container>
      </footer>
    </div>
  );
}

export default Home;