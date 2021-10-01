import { createContext } from 'react';

export const AuthContext = createContext({
  message : "",
  newmessage : () => {},
  userId: null,
  token: null,
  name: null,
  photo: null,
  login: () => {},
  logout: () => {}
});
