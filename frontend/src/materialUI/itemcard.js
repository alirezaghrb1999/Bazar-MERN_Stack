import React, { useContext } from 'react';
import './drawer.css'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MyModal from './modal'
import { AuthContext } from '../auth-context';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 700,
    width: 700
  },
  media: {
    height: 180,
  },
});

const ItemCard = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const toEditHandler = () => {
    const queryParams = [];
    queryParams.push(encodeURIComponent("name") + '=' + encodeURIComponent(props.information.name));
    queryParams.push(encodeURIComponent("price") + '=' + encodeURIComponent(props.information.price));
    queryParams.push(encodeURIComponent("description") + '=' + encodeURIComponent(props.information.description));
    const queryString = queryParams.join('&');
    history.push({
      pathname: `/items/${props.information._id}`,
      search: '?' + queryString
    });
  }

  const gotocomments = () => {
    history.push(`/${props.information.creator}/comments/${props.information._id}`)
  }

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.information.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2">
            {props.information.name}
          </Typography>
          <Typography gutterBottom variant="h8" component="h3">
            {"Price : " + props.information.price}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {"Description : " + props.information.description}
          </Typography>
        </CardContent>
        <Button onClick={gotocomments} variant="contained" color="primary" fullWidth> comments </Button>
      </CardActionArea>
      {auth.userId === props.information.creator && (
        <CardActions className="Auth">
          <MyModal itemid={props.information._id} />
            <Button onClick={toEditHandler} size="small" color="primary">
              edit
            </Button>
        </CardActions>
      )
      }
    </Card>
  );
}

export default ItemCard;
