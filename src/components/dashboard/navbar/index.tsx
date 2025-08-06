import { Button, Drawer } from "antd";
import { useState } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import "./Navbar.css";
import CompanyLogo from "../../../public/images/company-logo.svg";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
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
        <div className="menu_right">
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
          {/* Replace with an icon, e.g., hamburger icon */}
          Menu
        </Button>
        <Drawer
          title="Menu"
          placement="right"
          className="menu_drawer"
          closable={true}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            style={{ marginTop: 16, width: "100%" }}
          >
            Logout
          </Button>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;