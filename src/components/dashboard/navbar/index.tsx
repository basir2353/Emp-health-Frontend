import { Button, Drawer } from "antd";
import { useState } from "react";
import LeftMenu from "./LeftMenu";
import "./Navbar.css";
import CompanyLogo from "../../../public/images/company-logo.svg";
import RightMenu from "./RightMenu";

const Navbar = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Optionally redirect to login page
    window.location.reload();
  };

  return (
    <nav className="menu">
      <div className="menu__logo">
        <img src={CompanyLogo} className="App-logo" alt="logo" />
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RightMenu mode="horizontal" />
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={() => setOpenDrawer(true)}
        >
          {/* <Icon type="align-right" /> */}
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={() => setOpenDrawer(false)}
          open={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
          <Button type="primary" danger onClick={handleLogout} style={{ marginTop: 16, width: "100%" }}>
            Logout
          </Button>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
