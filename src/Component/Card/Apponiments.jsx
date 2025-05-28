import React from 'react';
import { Card, Typography, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title } = Typography;

function Appointments() {
  return (
    <Card style={{ width: 375, height: 418, border: '1px solid #ddd', marginRight: 10 }}>
        <Title level={3} style={{margin:'0'}}>  </Title>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0,  }}>
        <div style={{ width: 237, height: 207, backgroundImage: 'url("/doctor.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px 0px',  }}>
          <p style={{ width: 253, height: 44, fontFamily: 'Satoshi', fontStyle: 'normal', fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#525252' }}>
            You haven’t booked any appointments this week.
          </p>
          <Button type="primary" style={{ width: 147, height: 32, background: '#141414', border: '1px solid #141414', borderRadius: 4 }}>
            <span style={{ width: 115, height: 22, fontFamily: 'Satoshi', fontStyle: 'normal', fontWeight: 400, fontSize: 14, lineHeight: '22px', textAlign: 'center', color: '#FFFFFF' }}>
              Book Appointment 
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Appointments;
