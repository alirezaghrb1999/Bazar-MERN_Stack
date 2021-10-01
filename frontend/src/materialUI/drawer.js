import React, { useContext } from 'react';
import './drawer.css'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Link,Redirect } from 'react-router-dom';
import { AuthContext } from '../auth-context';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

const MyDrawer = (props) => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={() => props.changesituation(false)}
            onKeyDown={() => props.changesituation(false)}
        >
            <List className="Drawer">
                <Link to="/">
                    <ListItem button key={"home"}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"home"} />
                    </ListItem>
                </Link>

                <Link to="/users">
                    <ListItem button key={"home"}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"all users"} />
                    </ListItem>
                </Link>
                {auth.token && (
                        <ListItem button key={"home"} onClick={() => {history.push(`/${auth.userId}/items`);window.location.reload();}}> 
                            <ListItemIcon><InboxIcon /></ListItemIcon>
                            <ListItemText primary={"my items"} />
                        </ListItem>)
                }
                {auth.token && (
                    <Link to="/newitem">
                        <ListItem button key={"home"}>
                            <ListItemIcon><InboxIcon /></ListItemIcon>
                            <ListItemText primary={"add item"} />
                        </ListItem>
                    </Link>)
                }
                {(auth.token ? null :
                    <Link to="/authenticate">
                        <ListItem button key={"home"}>
                            <ListItemIcon><InboxIcon /></ListItemIcon>
                            <ListItemText primary={"register"} />
                        </ListItem>
                    </Link>)
                }
            </List>
        </div>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer anchor={'left'} open={props.situation} onClose={() => props.changesituation(false)}>
                    {list('left')}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default MyDrawer;