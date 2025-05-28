import { PhoneOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CompanyLogo from "../../../public/images/company-logo.svg";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const ChatBoxNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="menu">
      <div className="menu__logo">
        <img src={CompanyLogo} className="App-logo" alt="logo" />
      </div>
      <div className="menu__container">
        <div className="menu_rigth">
          <div className="flex gap-4">
            <Button
              type="primary"
              style={{
                background: "#141414",
                border: "1px solid #141414",
                borderRadius: 4,
              }}
              onClick={() => navigate("/inbox/call")}
            >
              <PhoneOutlined /> Start Call
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ChatBoxNavbar;
