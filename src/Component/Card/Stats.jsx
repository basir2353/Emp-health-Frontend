import React from "react";
import { Row, Col, Typography } from "antd";

const { Title, Paragraph } = Typography;

const StatsBox = () => {
  return (
    <div style={{ border: "1px solid #ddd", marginTop: "22px", padding: '10px', height:'218px', borderRadius: "4px",}}>
      <Row gutter={[16, 16]}>
        <Col flex="auto">
          <Title level={3} style={{ color: '#8F8F8F',margin:'0' }}>Basic Stats</Title>
          <div style={{ display: 'flex', flexDirection: 'column' ,marginTop:'30px'}}>
            <Paragraph style={{ fontSize: '16px', marginBottom: '5px' }}>Current Enrollments</Paragraph>
            <Paragraph style={{ fontSize: '20px', margin: '0' }}>0</Paragraph>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Paragraph style={{ fontSize: '16px', marginBottom: '5px' }}>Acquired Points</Paragraph>
            <Paragraph style={{ fontSize: '20px', margin: '0' }}>120</Paragraph>
          </div>
        </Col>
        <Col flex="auto">
          <Title level={3} style={{ marginBottom: '60px' }}> </Title>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Paragraph style={{ fontSize: '16px', marginBottom: '5px' }}>Work Life Balance Score</Paragraph>
            <Paragraph style={{ fontSize: '20px', margin: '0' }}>60</Paragraph>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Paragraph style={{ fontSize: '16px', marginBottom: '5px' }}>Completed Courses</Paragraph>
            <Paragraph style={{ fontSize: '20px', margin: '0' }}>2</Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatsBox;
