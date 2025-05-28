import { Button, Col, Row } from "antd";

const Navbar = () => {
  return (
    <Row style={{ height: "80px" }} align="middle">
      <Col span={22} push={1}>
        <img src="/assests/logo.svg" alt="" />
      </Col>

      <Col span={2} pull={1}>
        <Button>Support</Button>
      </Col>
    </Row>
  );
};

export default Navbar;
