import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../firebase";
import { handleLogin } from "../features/userSlice";
import { useDispatch } from "react-redux";
import "./styles/NavBar.css";
const NavBar = () => {
  const user = useSelector(selectUser);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(handleLogin());
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="nav">
      <div style={{ width: "300px", justifyContent: "end" }}>
        <ul className="nav__links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sales">Seller</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </div>
      <h1>
        SARA
      </h1>
      <div style={{ width: "300px", textAlign: "right" }}>
        <Button
          color="error"
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={() => handleSignOut()}
        >
          log out
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
