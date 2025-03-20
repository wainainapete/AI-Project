import React, { useState, useRef, useEffect } from "react";
import { Layout, Input, Typography, Space, Card, Button } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Text } = Typography;

const AIChatPlatform = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const newUserMessage = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setLoading(true); // Show loading wheel

    try {
      const response = await generateResponse(inputValue);
      const newSystemMessage = { text: response, sender: "system" };
      setMessages((prevMessages) => [...prevMessages, newSystemMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to AI model.", sender: "system" }]);
    } finally {
      setLoading(false); // Hide loading wheel
    }
  };

  const generateResponse = async (input) => {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      return data.response || "No response received from AI.";
    } catch (error) {
      throw new Error("Failed to connect to AI server");
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
        {/* Chat Input */}
        <Card style={{ marginBottom: "20px", padding: "10px", background: "#f5f5f5" }}>
          <Input
            placeholder="Type your message..."
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

          {/* Custom Spinning Wheel */}
          {loading && (
            <div className="loading-wheel"></div>
          )}
        </Card>

        {/* Clear Chat Button */}
        <Space style={{ marginTop: "10px" }}>
          <Button type="primary" danger onClick={handleClearChat} icon={<DeleteOutlined />}>
            Clear Chat
          </Button>
        </Space>
      </Content>

      {/* Custom Spinning Wheel CSS */}
      <style>
        {`
          .loading-wheel {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #1890ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
            margin: 20px 0;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Layout>
  );
};

export default AIChatPlatform;
