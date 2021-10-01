import React, { useContext } from 'react';
import './drawer.css'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ImageAvatar from './avatar';
import { AuthContext } from '../auth-context';

const useStyles = makeStyles({
  root: {
    width : 300,
    maxWidth: 445,
  },
});

const MyCard = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ImageAvatar photo={props.information.image}/>
        </div>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography gutterBottom variant="h5" component="h2">
              {props.information.name + " " + props.information.lastname}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="textSecondary" component="p">
              number of items : {props.information.items.length}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
      <CardActions className="Auth">
        <Link to={`/${props.information._id}/items`}>
          <Button size="large" color="primary">
            User Items
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default MyCard;
