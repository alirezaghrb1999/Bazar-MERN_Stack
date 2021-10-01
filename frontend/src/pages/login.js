import React, { useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const [iserror, setiserror] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setisloading] = useState(false);


  const [emailValidation, setemailValidation] = useState(false);
  const [passwordValidation, setpasswordValidation] = useState(false);
  const [emailMSG, setemailMSG] = useState("email required");
  const [passMSG, setpassMSG] = useState("password must be at least 5 characters");
  const [isSubmit, setisSubmit] = useState(false);
  const [istouched, setistouched] = useState(false);

  const emailHandler = (event) => {
    setemail(event.target.value);
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
    setpassword(event.target.value);
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

  const errorHandler = () => {
    setiserror(false);
    setisloading(false)
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setisSubmit(true)

    if (istouched && emailValidation && passwordValidation) {
      setisloading(true)
      axios({
        method: "post",
        url: "http://localhost:5000/users/login",
        data: JSON.stringify({
          email: email,
          password: password
        }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {
          setisloading(false)
          auth.newmessage("you logged in successfully!")
          auth.login(response.data.userId, response.data.token, response.data.name, response.data.image);
        })
        .catch((response) => {
          setErrorMessage(response.response.data.message);
          setiserror(true);
        });
    }
  }

  return (
    <div className="Auth" style={{ margin: "100px" }}>
      {iserror && <ErrorModal text={ErrorMessage} errorfunction={errorHandler} />}
      <Container component="main" maxWidth="xs" >
        {isloading ? <Progress /> :
          <div className={classes.paper} >
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                onChange={(event) => emailHandler(event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!emailValidation && isSubmit}
                helperText={emailMSG}
              />
              <TextField
                onChange={(event) => passwordHandler(event)}
                variant="outlined"
                margin="normal"
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
              <Button
                onClick={(event) => submitHandler(event)}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!istouched}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/authenticate">
                    {"Don't have an account? Sign Up"}
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

export default Login;