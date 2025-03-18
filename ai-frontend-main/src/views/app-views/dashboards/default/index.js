import React, { useState, useRef, useEffect } from "react";
import { Layout, Input, Typography, Space, Card, Button } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Text } = Typography;

const pendingTasks = [
  { id: 1, name: "Approve time sheets for Q1", progress: 50, deadline: "2025-01-30" },
  { id: 2, name: "Review employee performance", progress: 30, deadline: "2025-02-05" },
  { id: 3, name: "Update project timelines", progress: 70, deadline: "2025-01-25" },
];

const employees = [
  { key: "1", project: "Solichain", name: "John Doe", role: "Software Engineer", timeSheetStatus: "Pending" },
  { key: "2", project: "EMS", name: "Jane Smith", role: "Project Manager", timeSheetStatus: "Submitted" },
  { key: "3", project: "EMS", name: "Emily Johnson", role: "UI/UX Designer", timeSheetStatus: "Pending" },
  { key: "4", project: "Solichain", name: "Michael Brown", role: "QA Tester", timeSheetStatus: "Submitted" },
];

const ManagerDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newUserMessage = { text: inputValue, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputValue("");

      setTimeout(() => {
        const response = generateResponse(inputValue);
        const newSystemMessage = { text: response, sender: "system" };
        setMessages((prevMessages) => [...prevMessages, newSystemMessage]);
      }, 500);
    }
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("tasks")) {
      return `Pending Tasks: ${pendingTasks.map((task) => `${task.name} (Deadline: ${task.deadline})`).join(", ")}`;
    } else if (lowerInput.includes("employees")) {
      return `Employees: ${employees.map((emp) => `${emp.name} (${emp.role})`).join(", ")}`;
    } else if (lowerInput.includes("total")) {
      return `Total Pending Tasks: ${pendingTasks.length}, Total Employees: ${employees.length}, Time Sheets Submitted: ${employees.filter((e) => e.timeSheetStatus === "Submitted").length}`;
    } else {
      return "I'm still learning. Try asking about tasks or employees.";
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Layout style={{ minHeight: "100vh", padding: "20px" }}>
      <Content style={{ display: "flex", flexDirection: "column" }}>
        
        {/* Search Input at the Top */}
        <Card style={{ marginBottom: "20px", padding: "10px", background: "#f5f5f5" }}>
          <Input
            placeholder="Search tasks, employees, or information..."
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSendMessage}
            suffix={<SendOutlined onClick={handleSendMessage} style={{ fontSize: "20px", cursor: "pointer" }} />}
          />
        </Card>

        {/* Chat Container */}
        <Card style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }} ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: message.sender === "user" ? "#e6f7ff" : "#f0f0f0",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
                maxWidth: "70%",
              }}
            >
              <Text>{message.text}</Text>
            </div>
          ))}
        </Card>

        {/* Chat Input and Clear Button */}
        <Space style={{ marginTop: "10px" }}>
          <Button type="primary" danger onClick={handleClearChat} icon={<DeleteOutlined />}>
            Clear Chat
          </Button>
        </Space>

      </Content>
    </Layout>
  );
};

export default ManagerDashboard;
