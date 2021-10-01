import react, { useCallback, useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Navigation from './container/navigation';

import Authentication from './pages/authentication';
import EditItem from './pages/edititem';
import Home from './pages/home';
import Login from './pages/login';
import NewItem from './pages/newitem';
import UserItems from './pages/useritems';
import Users from './pages/users';
import Comments from './container/comments'
import { AuthContext } from './auth-context';
import SnackBar from './materialUI/snackbar'


const App = () => {
  const [token, settoken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [name, setname] = useState(false);
  const [photo, setphoto] = useState(false);
  const [message, setmessage] = useState("");

  const newmessage = useCallback((msg) => {
    setmessage(msg);
  }, []);

  useEffect(() => {
    if (message !== "") {
      document.getElementById("button").click();
      newmessage("")
    }
  }, [message]);

  const login = useCallback((uid, token, name, photo) => {
    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60 );
    settoken(token);
    setUserId(uid);
    setname(name);
    setphoto(photo);
    localStorage.setItem('userData', JSON.stringify({
      userId: uid,
      token: token,
      name: name,
      photo: photo,
      expiration: tokenExpirationDate.toISOString()
    }));
  }, []);

  const logout = useCallback(() => {
    settoken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, storedData.name, storedData.photo);
    }
    if(storedData && new Date(storedData.expiration) < new Date())
    {
      logout()
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/items/:itemid" exact>
          <EditItem />
        </Route>
        <Route path="/:userid/items" exact>
          <UserItems />
        </Route>
        <Route path="/newitem" exact>
          <NewItem />
        </Route>
        <Route path="/:userid/comments/:itemid" exact>
          <Comments />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/:userid/items" exact>
          <UserItems />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/authenticate" exact>
          <Authentication />
        </Route>
        <Route path="/:userid/comments/:itemid" exact>
          <Comments />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        name: name,
        photo: photo,
        message: message,
        login: login,
        logout: logout,
        newmessage: newmessage
      }}>
      <BrowserRouter>
        <Navigation />
        {routes}
        <SnackBar />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
