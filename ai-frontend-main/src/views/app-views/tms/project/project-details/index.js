import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, Table, Row, Col, Typography, message } from 'antd';
import API from "services/Api";
import moment from 'moment';

const { Title, Text } = Typography;

const ProjectDetail = () => {
  const { "*": project_id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const columns = [
    { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Phone No.', dataIndex: 'phone_no', key: 'phone_no' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Joining Date', dataIndex: 'joining_date', key: 'joining_date' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'National ID', dataIndex: 'national_id', key: 'national_id' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
  ];

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await API(`/projects/${project_id}/`, "get", {});
        if (response.status === "success") {
          setProject(response.data);
        } else {
          message.error("Failed to load project detail");
        }
      } catch (error) {
        message.error(error.message);
      }
    };


    fetchProjectDetail();
  }, [project_id]);



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await API("/employee/list/", "get", {});
        if (response.status === "success") {

          const filteredEmployees = response.data.filter(employee =>
            project.assigned_employees.includes(employee.id)
          );
          // console.log(filteredEmployees);

          setEmployees(filteredEmployees);
        } else {
          message.error("Failed to load designations");
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [project]);



  if (!project) {
    return <div>Project not found</div>;
  }

  // Convert startDate and endDate to moment objects
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={<Title level={2}>{project.name}</Title>}
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
            <p>{project.description || "No description available"}</p>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Text strong>Status:</Text>
            <Tag color={project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'blue' : 'grey'}>
              {project.status}
            </Tag>
          </Col>
          <Col span={12}>
            <Text strong>Assigned Users:</Text>
            {project.assignedUsers ? project.assignedUsers.join(', ') : "No users assigned"}
          </Col>
        </Row>
      </Card>
      <Card>
        <Table loading={loading} columns={columns} dataSource={employees} rowKey="email" />
      </Card>
    </div>
  );
};

export default ProjectDetail;