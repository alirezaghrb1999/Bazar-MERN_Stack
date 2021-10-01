import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { AuthContext } from '../auth-context';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 20,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const MyModal = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelHandler = () => {
    setOpen(false);
  };

  const deleteHandler = () => {
    axios({
      method: "delete",
      url: `http://localhost:5000/items/${props.itemid}`,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
    })
      .then((response) => {
        setOpen(false);
        window.location.reload()
        auth.newmessage("item deleted successfully!")
      })
      .catch((response) => {
        console.log(response.toJSON());
      });
  };

  return (
    <div>
      <Button onClick={handleOpen} size="small" color="secondary">
        delete
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Delete Item</h2>
            <p id="transition-modal-description">are you sure want to delete this item ?</p>
            <Button size="small" color="secondary" onClick={deleteHandler}>
              delete
            </Button>
            <Button size="small" color="primary" onClick={cancelHandler}>
              cancel
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default MyModal;