import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MyCard from './usercard';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin:10,
    maxWidth: '100%'
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const CardGrid = (props) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={10}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={10}>
          {props.users.map((value,index) => (
            <Grid key={index} item>
              <MyCard information={value}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}


export default CardGrid;
