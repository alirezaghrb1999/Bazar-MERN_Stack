import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { AuthContext } from '../auth-context';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import ErrorModal from '../materialUI/errormodal';
import Progress from '../materialUI/progress';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '85ch',
    },
  },
}));

const EditItem = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { itemid } = useParams();
  const location = useLocation();

  const [iserror, setiserror] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [name, setname] = useState(false);
  const [price, setprice] = useState(false);
  const [description, setdescription] = useState(false);
  const [isloading, setisloading] = useState(false);

  const [nameValidation, setnameValidation] = useState(true);
  const [priceValidation, setpriceValidation] = useState(true);
  const [descriptionValidation, setdescriptionValidation] = useState(true);

  const [nameMSG, setnameMSG] = useState("name required");
  const [priceMSG, setpriceMSG] = useState("price must be more than 0");
  const [descriptionMSG, setdescriptionMSG] = useState("description required");
  const [isSubmit, setisSubmit] = useState(false);
  const [istouched, setistouched] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    for (let param of searchParams.entries()) {
      if (param[0] === 'name') {
        setname(param[1]);
      }
      if (param[0] === 'price') {
        setprice(param[1]);
      }
      if (param[0] === 'description') {
        setdescription(param[1]);
      }
    }
  }, [location])

  const nameHandler = (event) => {
    setname(event.target.value);
    setistouched(true)
    if (event.target.value.length === 0) {
      setnameValidation(false)
      setnameMSG("name required")
    }
    else {
      setnameValidation(true)
      setnameMSG("")
    }
  };

  const priceHandler = (event) => {
    setprice(parseInt(event.target.value));
    setistouched(true)
    if (event.target.value.length === 0) {
      setpriceValidation(false)
      setpriceMSG("price required")
    }
    if (parseInt(event.target.value) < 0) {
      setpriceValidation(false)
      setpriceMSG("price must be more than 0")
    }
    else {
      setpriceValidation(true)
      setpriceMSG("")
    }
  };

  const descriptionHandler = (event) => {
    setdescription(event.target.value);
    setistouched(true)
    if (event.target.value.length === 0) {
      setdescriptionValidation(false)
      setdescriptionMSG("description required")
    }
    else {
      setdescriptionValidation(true)
      setdescriptionMSG("")
    }
  };

  const errorHandler = () => {
    setiserror(false);
    setisloading(false);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setisSubmit(true);

    if (istouched && nameValidation && priceValidation && descriptionValidation) {
      setisloading(true)
      axios({
        method: "patch",
        url: `http://localhost:5000/items/${itemid}`,
        data: JSON.stringify({
          name: name,
          price: price,
          description: description,
          creator: auth.userId
        }),
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
      })
        .then((response) => {
          setisloading(false)
          auth.newmessage("item edited successfully!")
          history.push(`/${auth.userId}/items`);
        })
        .catch((response) => {
          setErrorMessage(response.response.data.message);
          setiserror(true);
        });
    }
  };

  const cancelHandler = () => {
    history.push(`/${auth.userId}/items`);
  }

  return (
    <form className={classes.root} noValidate autoComplete="off" style={{ margin: "100px" }}>
      {iserror && <ErrorModal text={ErrorMessage} errorfunction={errorHandler} />}
      <div style={{ display: "flex", justifyContent: "center", margin: "80px" }}>
        {isloading ? <Progress /> :
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-multiline-flexible"
              label="Name"
              onChange={(event) => nameHandler(event)}
              variant="outlined"
              value={name}
              error={!nameValidation && isSubmit}
              helperText={nameMSG}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="price"
              onChange={(event) => priceHandler(event)}
              variant="outlined"
              value={price}
              error={!priceValidation && isSubmit}
              helperText={priceMSG}
            />
            <TextField
              id="outlined-multiline-static"
              label="Discription"
              onChange={(event) => descriptionHandler(event)}
              multiline
              rows={4}
              variant="outlined"
              value={description}
              error={!descriptionValidation && isSubmit}
              helperText={descriptionMSG}
            />

            <Button disabled={!istouched} variant="contained" color="primary" onClick={(event) => submitHandler(event)}>
              Edit Item
            </Button>
            <Button style={{width:"150px",margin:"10px 2px"}} onClick={cancelHandler} variant="contained" component="label" color="primary"> cancel edit </Button>
          </div>
        }
      </div>
    </form>
  );
}


export default EditItem;