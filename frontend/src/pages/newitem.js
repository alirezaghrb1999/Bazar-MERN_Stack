import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../auth-context';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
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

const InputItem = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const history = useHistory();

  const [iserror, setiserror] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [name, setname] = useState(false);
  const [price, setprice] = useState(false);
  const [description, setdescription] = useState(false);
  const [selectedFile, setselectedFile] = useState(false);
  const [isloading, setisloading] = useState(false);


  const [nameValidation, setnameValidation] = useState(false);
  const [priceValidation, setpriceValidation] = useState(false);
  const [descriptionValidation, setdescriptionValidation] = useState(false);

  const [nameMSG, setnameMSG] = useState("name required");
  const [priceMSG, setpriceMSG] = useState("price must be more than 0");
  const [descriptionMSG, setdescriptionMSG] = useState("description required");
  const [isSubmit, setisSubmit] = useState(false);
  const [istouched, setistouched] = useState(false);

  const errorHandler = () => {
    setiserror(false);
    setisloading(false);
  }

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

  const fileHandler = (event) => {
    setselectedFile(event.target.files[0])
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setisSubmit(true);

    if (istouched && nameValidation && priceValidation && descriptionValidation) {
      setisloading(true)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('creator', auth.userId);
      formData.append('image', selectedFile);
      axios.post("http://localhost:5000/items", formData, { headers: { Authorization: 'Bearer ' + auth.token } })
        .then((response) => {
          setisloading(false)
          auth.newmessage("item created successfully!")
          history.push(`/${auth.userId}/items`);
        })
        .catch((response) => {
          setErrorMessage(response.response.data.message);
          setiserror(true);
        });
    }
  };

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
              error={!nameValidation && isSubmit}
              helperText={nameMSG}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="price"
              onChange={(event) => priceHandler(event)}
              variant="outlined"
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
              error={!descriptionValidation && isSubmit}
              helperText={descriptionMSG}
            />
            <Button
              style={{ height: "35px", width: "180px",margin:"10px" }}
              variant="contained"
              component="label"
              color="primary"
            >
              <p style={{ fontSize: "11px" }}>choose a profile photo</p>
              <input hidden type="file" name="file" onChange={(event) => fileHandler(event)} />
            </Button>
            <Button disabled={!istouched} onClick={(event) => submitHandler(event)} variant="contained" color="primary" >
              Submit Item
            </Button>
          </div>
        }
      </div>
    </form>
  );
}


export default InputItem;