import { createContext, useState } from "react";
import { localStorageName } from "./functions";
export const LoginContext = createContext();
export default function LoginContextProvider({ children }) {
  const [login, setLogin] = useState(localStorage.getItem(localStorageName) != null);
  const [user, aa] = useState(localStorage.getItem(localStorageName));
  function setUser(token) {
    localStorage.setItem(localStorageName, token);
    setLogin(true)
    aa(token);
  }
  function logout() {
    localStorage.removeItem(localStorageName);
    setLogin(false)
    aa(null)
  }
  return (
    <LoginContext.Provider value={{ login, setLogin, user, setUser, logout }}>
      {children}
    </LoginContext.Provider>
  );
}
