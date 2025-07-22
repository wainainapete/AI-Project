import React, { useState, useRef, useEffect } from "react";
import { Layout, Input, Typography, Space, Card, Button, Spin } from "antd";
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
    setLoading(true);

    try {
      const response = await generateResponse(inputValue, messages);
      const newSystemMessage = { text: response, sender: "system" };
      setMessages((prevMessages) => [...prevMessages, newSystemMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: `Error: ${error.message || "Failed to get response from local LLM."}`, sender: "system" }]);
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = async (input, conversationHistory) => {
    try {
      // Prepare messages for Ollama API (which is OpenAI-compatible)
      const formattedMessages = conversationHistory.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));
      formattedMessages.push({ role: "user", content: input });

      // !! CHANGE THE ENDPOINT AND REMOVE API KEY !!
      const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST", // <-- THIS IS THE KEY! It MUST be POST.
  headers: {
    "Content-Type": "application/json",
    // No "Authorization" header needed for local Ollama
  },
  body: JSON.stringify({
    model: "gemma:2b", // <--- IMPORTANT: This MUST be a model you have actually pulled (e.g., phi3:mini, tinyllama, etc.)
    messages: formattedMessages, // Your conversation history
    temperature: 0.7,
    stream: false // Typically set to false for immediate response in this setup
  }),
});


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Local LLM API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      // Ollama's /api/chat response structure is also very similar to OpenAI's
      return data.message.content || "No response received from local LLM."; // <-- Adjusted for Ollama /api/chat
    } catch (error) {
      throw new Error(`Failed to connect to local LLM: ${error.message}`);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
            onPressEnter={!loading ? handleSendMessage : undefined}
            suffix={
              <SendOutlined
                onClick={!loading ? handleSendMessage : undefined}
                style={{ fontSize: "20px", cursor: loading ? "not-allowed" : "pointer", color: loading ? "#bfbfbf" : "inherit" }}
              />
            }
            disabled={loading}
          />
        </Card>

        {/* Chat Container */}
        <Card style={{ flexGrow: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column" }} ref={chatContainerRef}>
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
                wordBreak: "break-word",
              }}
            >
              <Text>{message.text}</Text>
            </div>
          ))}

          {/* Ant Design Spin for loading indication */}
          {loading && (
            <div style={{ alignSelf: "flex-start", margin: "10px 0" }}>
              <Spin size="large" />
            </div>
          )}
        </Card>

        {/* Clear Chat Button */}
        <Space style={{ marginTop: "10px", justifyContent: "flex-end" }}>
          <Button type="primary" danger onClick={handleClearChat} icon={<DeleteOutlined />} disabled={loading}>
            Clear Chat
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default AIChatPlatform;