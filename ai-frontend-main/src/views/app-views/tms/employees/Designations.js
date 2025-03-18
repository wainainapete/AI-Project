import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, message } from 'antd';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import API from "services/Api";

const { TextArea } = Input;

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const formRef = useRef(null);

  const handleAddDesignation = () => {
    setIsModalVisible(true);
  };



  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        setLoading(true);
        const response = await API("/designations/list", "get", {});
        if (response.status === "success") {
          setDesignations(response.data);
        } else {
          message.error("Failed to load designations");
        }
      } catch (error) {
        message.error(error.message);
      } finally{
        setLoading(false);
      }
    };

    fetchDesignations();
  }, []);



  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const payload = {
          name: values.name,
          job_description: values.job_description,
        }

        // setDesignations([...designations, payload]);
        // setIsModalVisible(false);


        API("designations/", "POST", payload)
          .then((response) => {
            if (response.status === "success") {
              message.success(
                `Designation added successfully`
              );
              setDesignations([...designations, payload]);
            } else {
              message.error("Failed to add designation");
            }
          })
          .catch(() => {
            message.error("Failed to add designation");
          });

        formRef.current.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Designation Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'job_description', key: 'description' },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: "25px" }}>
        <Col>
          <Input
            placeholder="Search Designation"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDesignation}>
            Add Designation
          </Button>
        </Col>
      </Row>
      <Table loading={loading} columns={columns} dataSource={designations} rowKey="name" />
      <Modal
        title="Add Designation"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        onOk={handleOk}
      
      >
        <Form ref={formRef} layout="vertical">
          <Form.Item label="Designation Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="job_description" rules={[{ required: true }]}>
            <TextArea placeholder="Designation job_description ...." rows={8} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Designations;

