import React, { useState, useRef, useEffect } from 'react';
import { CalendarOutlined, UserOutlined, DashboardOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, List, Divider, Spin, Typography } from 'antd';
import 'antd/dist/reset.css';
import ChatBotAvatar from "../../public/images/onboarding/animoji.svg";

const { Title } = Typography;

const data = {
  "navigation": [
    { "category": ["I want to book an appointment", "How can I schedule an appointment?", "Book a doctor's appointment"], "response": "You can book an appointment [here](your-website-url/health/appointments).", "link": "your-website-url/health/appointments" },
    { "category": ["Show me the list of doctors", "I want to see doctors", "Doctors available"], "response": "You can view the list of doctors [here](your-website-url/health/doctors).", "link": "your-website-url/health/doctors" },
    { "category": ["Go to Dashboard", "Show me the dashboard", "Open dashboard"], "response": "You can access the dashboard [here](your-website-url/health).", "link": "your-website-url/health" },
    { "category": ["Open chat", "Go to my inbox", "I want to send a message"], "response": "You can open your inbox [here](your-website-url/inbox).", "link": "your-website-url/inbox" },
    { "category": ["Show me wellness courses", "I want to see wellness content", "Go to wellness"], "response": "You can access the wellness section [here](your-website-url/wellness).", "link": "your-website-url/wellness" },
    { "category": ["Show safety dashboard", "Open safety section", "Go to safety"], "response": "You can view the safety dashboard [here](your-website-url/safety).", "link": "your-website-url/safety" },
    { "category": ["I want to schedule an appointment for an admin", "Admin schedule appointment", "Schedule appointment for doctor"], "response": "You can schedule an appointment [here](your-website-url/health/admin-schedule-appointments).", "link": "your-website-url/health/admin-schedule-appointments" },
    { "category": ["Schedule appointment for doctor"], "response": "You can schedule an appointment [here](your-website-url/health/doctor-schedule-appointments).", "link": "your-website-url/health/doctor-schedule-appointments" },
    { "category": ["Show notifications", "Go to notifications", "Open notification section"], "response": "You can view notifications [here](your-website-url/health/notification).", "link": "your-website-url/health/notification" },
    { "category": ["Show insurance details", "Go to insurance section", "I want to see insurance information"], "response": "You can view insurance information [here](your-website-url/health/insurance).", "link": "your-website-url/health/insurance" }
  ],
  "available_doctors": [
    { 
      "name": "Dr. Maria Summers", 
      "profession": "Neurologist", 
      "education": "M.B.B.S., F.C.P.S. (Neurology)", 
      "experience": "8 Years", 
      "available_hours": "5:00 PM - 9:00 PM", 
      "image": "DrMaria", 
      "gender": "female",
      "related_conditions": ["headache", "migraine", "epilepsy", "stroke"]
    },
    { 
      "name": "Dr. Akhtar Javed", 
      "profession": "General Physician", 
      "education": "MBBS, MCPS (Medicine)", 
      "experience": "5 Years", 
      "available_hours": "1:00 PM - 6:00 PM", 
      "image": "DrAkhtar", 
      "gender": "male",
      "related_conditions": ["fever", "cold", "flu", "general illness"]
    },
    { 
      "name": "Dr. Andrew Smithdd", 
      "profession": "Cardiology, Interventional Cardiologist", 
      "education": "M.B.B.S., Dip. Cardiology, M.D Cardio, MESC (Europe), MACC (USA)", 
      "experience": "7 Years", 
      "available_hours": "3:00 PM - 7:00 PM", 
      "image": "DrAndrew", 
      "gender": "male",
      "related_conditions": ["chest pain", "high blood pressure", "heart disease", "arrhythmia"]
    },
    { 
      "name": "Dr. Alisha Kane", 
      "profession": "Dermatologist, Aesthetic Physician", 
      "education": "M.B.B.S., MSc Clinical Dermatology, Diploma in Aesthetic Medicine", 
      "experience": "10 Years", 
      "available_hours": "1:00 PM - 7:00 PM", 
      "image": "DrAlishaKane", 
      "gender": "female",
      "related_conditions": ["acne", "eczema", "psoriasis", "skin cancer"]
    }
  ]
};

const getResponseFromData = (input) => {
  const lowerInput = input.toLowerCase();
  const keywords = lowerInput.split(" ");

  // Check navigation responses
  for (const item of data.navigation) {
    for (const category of item.category) {
      if (keywords.some(keyword => category.toLowerCase().includes(keyword))) {
        return `${item.response}`;
      }
    }
  }

  // Check available doctors based on related conditions
  for (const doctor of data.available_doctors) {
    if (keywords.some(keyword => doctor.related_conditions.some(condition => condition.toLowerCase().includes(keyword)))) {
      return `${doctor.name}:
              \nProfession: ${doctor.profession}
              \nEducation: ${doctor.education}
              \nExperience: ${doctor.experience}
              \nAvailable Hours: ${doctor.available_hours}
              \nFor more details, visit [here](your-website-url/health/doctors).`;
    }
  }

  // Check available doctors by name or profession
  for (const doctor of data.available_doctors) {
    if (keywords.some(keyword => doctor.name.toLowerCase().includes(keyword)) ||
        keywords.some(keyword => doctor.profession.toLowerCase().includes(keyword))) {
      return `${doctor.name}:
              \nProfession: ${doctor.profession}
              \nEducation: ${doctor.education}
              \nExperience: ${doctor.experience}
              \nAvailable Hours: ${doctor.available_hours}`;
    }
  }

  return `I'm sorry, I couldn't find the information you're looking for. For further assistance, you can contact our support team or try asking something else. You can also reach out to customer support [here](your-website-url/support).`;
};

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleOptionSelect = (option) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: ` ${option}`, from: 'user' }
    ]);
    
    setIsLoading(true);
    
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: getResponseFromData(option), from: 'bot' }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleMessageSubmit = () => {
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: input, from: 'user' }
      ]);
      setInput('');
      setIsLoading(true);
      
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: getResponseFromData(input), from: 'bot' }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  return (
    <div className="chat-container" style={{ position: 'relative' }}>
      <Button 
        type="default" 
        shape="circle" 
        icon={<img src={ChatBotAvatar} alt="Chatbot Icon" style={{ width: 52, height: 52 }} />} 
        onClick={toggleChat}
        style={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          width: 60, 
          height: 60, 
          padding: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'transparent', 
          border: 'none', 
          borderRadius: '50%'
        }}
      />
      
      <Modal
        title={<Title level={4}>Dashboard Bot</Title>}
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={400}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ height: '60vh', overflowY: 'auto', marginBottom: 16 }}>
        <List
  itemLayout="horizontal"
  dataSource={messages}
  renderItem={msg => (
    <List.Item style={{ justifyContent: msg.from === 'user' ? 'flex-start':'flex-end'   }}>
      <List.Item.Meta
        title={msg.from === 'user' ? 'You' : 'Bot'}
        description={msg.text}
        style={{
          textAlign: 'left', // All messages text aligned left
          backgroundColor: msg.from === 'user' ? '#e6f7ff' : '#f0f0f0',
          borderRadius: 8,
          padding: 12,
          maxWidth: '70%', // Adjust the message box width
          margin: '4px 0',
          alignSelf: msg.from === 'user' ?  'flex-start' : 'flex-end' , // Align based on user or bot
          marginLeft: msg.from === 'user' ? '0' : 'auto', // Ensure user message stays right
          marginRight: msg.from === 'user' ? 'auto' : '0' // Ensure bot message stays left
        }}
      />
    </List.Item>
  )}
>


            {isLoading && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Spin size="small" />
              </div>
            )}
          </List>
          <div ref={chatEndRef} />
        </div>

        <Divider />
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button 
              type="default" 
              onClick={() => handleOptionSelect('I want to book an appointment')}
              icon={<CalendarOutlined />}
            >
              Book Appointmentkjk
            </Button>
            <Button 
              type="default" 
              onClick={() => handleOptionSelect('Show me the list of doctors')}
              icon={<UserOutlined />}
            >
              List of Doctors
            </Button>
            <Button 
              type="default" 
              onClick={() => handleOptionSelect('Go to Dashboard')}
              icon={<DashboardOutlined />}
            >
              Dashboard
            </Button>
            <Button 
              type="default" 
              onClick={() => handleOptionSelect('Open chat')}
              icon={<MailOutlined />}
            >
              Open Chat
            </Button>
          </div>

          <div style={{ display: 'flex', marginTop: 8 }}>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{ borderRadius: '4px 0 0 4px', flex: 1 }}
            />
            <Button 
              type="primary" 
              onClick={handleMessageSubmit}
              style={{ borderRadius: '0 4px 4px 0', backgroundColor: '#000000' }}
            >
              Send
            </Button>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default Bot;
