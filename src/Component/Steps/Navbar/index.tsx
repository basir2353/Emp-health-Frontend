import { Button } from "antd";
import CompanyLogo from "../../../public/images/company-logo.svg";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="menu">
      <div className="menu__logo">
        <img src={CompanyLogo} className="App-logo" alt="logo" />
      </div>
      <div className="menu__container">
        <Button className="menu__mobile-button" type="default">
          Support
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
