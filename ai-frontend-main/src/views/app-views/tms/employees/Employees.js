import React, { useState, useRef, useEffect } from 'react';
import { Table, Row, Col, Card, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import API from "services/Api";

const { Option } = Select;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesRes, departmentsRes, designationsRes] = await Promise.all([
          API("/employee/list/", "GET"),
          API("/departments/list/", "GET"),
          API("/designations/list", "GET"),
        ]);

        if (employeesRes.status === "success") setEmployees(employeesRes.data);
        else message.error("Failed to load employees");

        if (departmentsRes.status === "success") setDepartments(departmentsRes.data);
        else message.error("Failed to load departments");

        if (designationsRes.status === "success") setDesignations(designationsRes.data);
        else message.error("Failed to load designations");

      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to refresh employee list
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await API("/employee/list/", "GET");
      if (response.status === "success") {
        setEmployees(response.data);
      } else {
        message.error("Failed to fetch employee data");
      }
    } catch (error) {
      message.error("Error fetching employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const payload = {
          full_name: values.full_name,
          phone_no: values.phone_no,
          joining_date: values.joining_date.format('YYYY-MM-DD'),
          company_email: values.email,
          status: values.status,
          national_id: values.national_id,
          designation: values.designation,
          reportsTo: values.reportsTo,
        };

        API("/employee/register/", "POST", payload)
          .then((response) => {
            if (response.status === "success") {
              message.success(`Employee ${values.full_name} added successfully`);
              fetchEmployees();
              setIsModalVisible(false);
              formRef.current.resetFields();
            } else {
              message.error("Failed to add Employee");
            }
          })
          .catch(() => message.error("Failed to add Employee"));
      })
      .catch((info) => console.log("Validation Failed:", info));
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Phone No.', dataIndex: 'phone_no', key: 'phone_no' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Joining Date', dataIndex: 'joining_date', key: 'joining_date' },
    { title: 'Email', dataIndex: 'company_email', key: 'email' },
    { title: 'National ID', dataIndex: 'national_id', key: 'national_id' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    { title: 'Reports To', dataIndex: 'reportsTo', key: 'reportsTo' },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: "25px" }}>
        <Col>
          <Input placeholder="Search Employee" prefix={<SearchOutlined />} style={{ width: 200 }} />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Col>
      </Row>

      <Card>
        <Table columns={columns} dataSource={employees} rowKey="email" loading={loading} />
      </Card>

      <Modal
        title="Add Employee"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        onOk={handleOk}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Card>
          <Form ref={formRef} layout="vertical" style={{ padding: "0 24px" }}>
            <Form.Item label="Full Name" name="full_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                  <Select placeholder="Select Department">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                      ))
                    ) : (
                      <Option disabled>No Departments Available</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone No." name="phone_no" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                  <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Joining Date" name="joining_date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="National ID" name="national_id" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Reports To" name="reportsTo" rules={[{ required: true }]}>
                  <Select placeholder="Select Supervisor">
                    {employees.length > 0 ? (
                      employees.map((emp) => (
                        <Option key={emp.id} value={emp.id}>{emp.full_name}</Option>
                      ))
                    ) : (
                      <Option disabled>No Employees Available</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Designation" name="designation" rules={[{ required: true }]}>
                  <Select placeholder="Select Designation">
                    {designations.length > 0 ? (
                      designations.map((desig) => (
                        <Option key={desig.id} value={desig.id}>{desig.name}</Option>
                      ))
                    ) : (
                      <Option disabled>No Designations Available</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Employees;
