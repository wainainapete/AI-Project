import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, Row, Col, Typography, message } from 'antd';
import API from "services/Api";
import moment from 'moment';

const { Title, Text } = Typography;

const TaskDetail = () => {
  const { "*": task_id } = useParams();
  const [task, setTask] = useState({});

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await API(`/tasks/${task_id}/`, "get", {});
        if (response.status === "success") {
          setTask(response.data);
        } else {
          message.error("Failed to load task detail");
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchTaskDetail();
  }, [task_id]);

  const tasks = [
    {
      id: 1,
      name: "Design the project layout",
      status: "In Progress",
      progress: 70,
      startDate: "2025-02-01", // String date
      endDate: "2025-02-01", // String date
    },
    {
      id: 2,
      name: "Implement authentication module",
      status: "Completed",
      progress: 100,
      startDate: "2025-02-01", // String date
      endDate: "2025-01-15", // String date
    },
    {
      id: 3,
      name: "Setup database schema",
      status: "Pending",
      progress: 0,
      startDate: "2025-02-01", // String date
      endDate: "2025-02-10", // String date
    },
  ];

  if (!task) {
    return <div>Task not found</div>;
  }

  // Convert startDate and endDate to moment objects
  const startDate = moment(task.startDate);
  const endDate = moment(task.endDate);

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={<Title level={2}>{task.name}</Title>}
        style={{
          // maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Start Date:</Text> {startDate.format('YYYY-MM-DD')}
          </Col>
          <Col span={12}>
            <Text strong>End Date:</Text> {endDate.format('YYYY-MM-DD')}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Text strong>Description:</Text>
            <p>{task.description || "No description available"}</p>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Text strong>Status:</Text>
            <Tag color={task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'blue' : 'grey'}>
              {task.status}
            </Tag>
          </Col>
          <Col span={12}>
            <Text strong>Assigned Users:</Text>
            {task.assignedUsers ? task.assignedUsers.join(', ') : "No users assigned"}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TaskDetail;