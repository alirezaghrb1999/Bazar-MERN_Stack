import React, { useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth-context';
import axios from 'axios';
import ErrorModal from '../materialUI/errormodal';
import Progress from '../materialUI/progress';
import validator from 'validator';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Authentication = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const [iserror, setiserror] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [name, setname] = useState(false);
  const [lastname, setlastname] = useState(false);
  const [email, setemail] = useState(false);
  const [password, setpassword] = useState(false);
  const [selectedFile, setselectedFile] = useState(false);
  const [isloading, setisloading] = useState(false);

  const [nameValidation, setnameValidation] = useState(false);
  const [lastnameValidation, setlastnameValidation] = useState(false);
  const [emailValidation, setemailValidation] = useState(false);
  const [passwordValidation, setpasswordValidation] = useState(false);

  const [nameMSG, setnameMSG] = useState("name required");
  const [lastnameMSG, setlastemailMSG] = useState("lastname required");
  const [emailMSG, setemailMSG] = useState("email required");
  const [passMSG, setpassMSG] = useState("password must be at least 5 characters");
  const [isSubmit, setisSubmit] = useState(false);
  const [istouched, setistouched] = useState(false);


  const nameHandler = (event) => {
    setname(event.target.value)
    setistouched(true)
    if (event.target.value.length === 0) {
      setnameValidation(false)
      setnameMSG("name required")
    }
    else {
      setnameValidation(true)
      setnameMSG("")
    }
  }
  const lastnameHandler = (event) => {
    setlastname(event.target.value)
    setistouched(true)
    if (event.target.value.length === 0) {
      setlastnameValidation(false)
      setlastemailMSG("lastname required")
    }
    else {
      setlastnameValidation(true)
      setlastemailMSG("")
    }
  }
  const emailHandler = (event) => {
    setemail(event.target.value)
    setistouched(true)
    if (event.target.value.length === 0) {
      setemailValidation(false)
      setemailMSG("email required")
    }
    if (!validator.isEmail(event.target.value)) {
      setemailValidation(false)
      setemailMSG("invalid email")
    }
    else {
      setemailValidation(true)
      setemailMSG("")
    }
  }
  const passwordHandler = (event) => {
    setpassword(event.target.value)
    setistouched(true)
    if (event.target.value.length < 5) {
      setpasswordValidation(false)
      setpassMSG("password must be at least 5 characters")
    }
    else {
      setpasswordValidation(true)
      setpassMSG("")
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setisSubmit(true)

    if (istouched && nameValidation && lastnameValidation && emailValidation && passwordValidation) {
      setisloading(true)
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', name);
      formData.append('lastname', lastname);
      formData.append('password', password);
      formData.append('image', selectedFile);
      axios.post("http://localhost:5000/users/register", formData)
        .then((response) => {
          setisloading(false);
          auth.newmessage("you registered successfully!")
          auth.login(response.data.userId, response.data.token, response.data.name, response.data.image);
        })
        .catch((response) => {
          setErrorMessage(response.response.data.message);
          setiserror(true);
        });
    }
  }

  const fileHandler = (event) => {
    setselectedFile(event.target.files[0])
  }
  const errorHandler = () => {
    setiserror(false);
    setisloading(false);
  }

  return (
    <div className="Auth" style={{ margin: "100px" }}>
      {iserror && <ErrorModal text={ErrorMessage} errorfunction={errorHandler} />}
      <Container component="main" maxWidth="xs">
        {isloading ? <Progress /> :
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={(event) => nameHandler(event)}
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={!nameValidation && isSubmit}
                    helperText={nameMSG}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={(event) => lastnameHandler(event)}
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    error={!lastnameValidation && isSubmit}
                    helperText={lastnameMSG}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    onChange={(event) => emailHandler(event)}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={!emailValidation && isSubmit}
                    helperText={emailMSG}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={(event) => passwordHandler(event)}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={!passwordValidation && isSubmit}
                    helperText={passMSG}
                  />
                </Grid>
                <Button
                  style={{ height: "35px", width: "180px",margin:"10px" }}
                  variant="contained"
                  component="label"
                  color="primary"
                >
                  <p style={{ fontSize: "11px" }}>choose a profile photo</p>
                  <input hidden type="file" name="file" onChange={(event) => fileHandler(event)} />
                </Button>
              </Grid>
              <Button
                onClick={(event) => submitHandler(event)}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!istouched}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        }
      </Container>
    </div>
  );
}


export default Authentication;