import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { Fade } from "react-reveal";
import "../styles/VentasModulo.css";
import VentasTabla from "./SalesTable";
import VentasModuloForm from "./SalesModuleForm";
import NoPermits from "../NoPermits";

const SalesModule = () => {
  const uri = "http://localhost:8080";
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [typeOfUser, setTypeOfUser] = useState({ type: "", status: "" });
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [isEditing, setIsEditing] = useState({ state: false, id: "" });
  const [nameProduct, setNameProduct] = useState("");
  const [valueUnit, setValueUnit] = useState(null);
  const [idProduct, setIdProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [newProduct, setNewProduct] = useState({
    quantity: "",
    idClient: "",
    nameClient: "",
  });
  const handleNewProduct = async () => {
    const { quantity, idClient, nameClient } = newProduct;
    await axios
      .post(uri + "/sales", {
        nameProduct,
        valueUnit,
        quantity,
        idClient,
        nameClient,
        id: idProduct,
        total: parseInt(valueUnit) * parseInt(newProduct.quantity),
        date: JSON.stringify(new Date()).replace("T", ",").slice(1, 17),
        nameSeller: user.name,
      })
      .then(({ data }) => setRows(data))
      .catch((e) => console.error(e));
    setSelectedIndex(null);
    setNameProduct("");
    setValueUnit(null);
    setNewProduct({
      quantity: "",
      idClient: "",
      nameClient: "",
    });
  };
  const handleUpdateProduct = async () => {
    await axios
      .put(uri + `/sales/${isEditing.id}`, {
        nameProduct: nameProduct,
        valueUnit: valueUnit,
        total: parseInt(valueUnit) * parseInt(newProduct.quantity),
        quantity: newProduct.quantity,
        idClient: newProduct.idClient,
        nameClient: newProduct.nameClient,
      })
      .then(({ data }) => setRows(data))
      .catch((e) => console.error(e));
    setSelectedIndex(null);
    setNameProduct("");
    setNewProduct({
      quantity: "",
      idClient: "",
      nameClient: "",
    });
    setIsEditing({ ...isEditing, state: false, id: "" });
  };
  const handleOnChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };
  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    setNameProduct(options[index].description);
    setValueUnit(options[index].price);
    setIdProduct(options[index].idProduct);
    setAnchorEl(null);
  };
  const getUsers = async () => {
    await axios.get(uri + "/users").then(({ data }) => {
      const userActual = data.find((userFind) => userFind.idGoogle === user.id);
      if (userActual) {
        if (userActual.role === "admin" && userActual.estado === "Active") {
          setTypeOfUser({ ...typeOfUser, type: "admin", status: "active" });
        }
        if (userActual.role === "admin" && userActual.estado === "Inactive") {
          setTypeOfUser({ ...typeOfUser, type: "admin", status: "inactive" });
        }
        if (userActual.role === "user" && userActual.estado === "Active") {
          setTypeOfUser({ ...typeOfUser, type: "user", status: "active" });
        }
        if (userActual.role === "user" && userActual.estado === "Inactive") {
          setTypeOfUser({ ...typeOfUser, type: "user", status: "inactive" });
        }
      }
    });
  };
  useEffect(() => {
    getUsers();
  }, []);
  if (
    (typeOfUser.type === "admin" && typeOfUser.status === "active") ||
    (typeOfUser.type === "user" && typeOfUser.status === "active")
  ) {
    return (
      <div className="ventasModulo">
        <Fade left>
          <div className="ventasModulo__left">
            <div>
              <List component="div">
                <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
                  Sales
                </h1>
                <ListItem
                  style={{ borderBottom: "1px solid black" }}
                  button
                  id="lock-button"
                  aria-haspopup="listbox"
                  aria-controls="lock-menu"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <ListItemText primary={nameProduct || "Select option"} />
                  <KeyboardArrowDownIcon />
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  "aria-labelledby": "lock-button",
                  role: "listbox",
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option.description}
                    selected={index === selectedIndex}
                    onClick={() => handleMenuItemClick(index)}
                  >
                    {option.description}
                  </MenuItem>
                ))}
              </Menu>
            </div>
            <VentasModuloForm
              handleNewProduct={handleNewProduct}
              handleUpdateProduct={handleUpdateProduct}
              handleOnChange={handleOnChange}
              valueUnit={valueUnit}
              newProduct={newProduct}
              isEditing={isEditing}
            />
          </div>
        </Fade>
        <Fade right>
          <div className="ventasModulo__right">
            <VentasTabla
              rows={rows}
              setRows={setRows}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setNewProduct={setNewProduct}
              setSelectedIndex={setSelectedIndex}
              options={options}
              setOptions={setOptions}
              setNameProduct={setNameProduct}
              setValueUnit={setValueUnit}
            />
          </div>
        </Fade>
      </div>
    );
  }
  return <NoPermits />;
};

export default SalesModule;
