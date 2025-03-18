// import React, { useState, useEffect } from 'react';
// import { Table, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   // Fetch Users from Backend
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/employees/list'); // Update with your correct endpoint
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       message.error('Failed to fetch users.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Save User
//   const handleSave = async (values) => {
//     try {
//       if (editingUser) {
//         // Update existing user
//         await axios.put(`/api/employees/${editingUser.id}/`, {
//           ...values,
//           joining_date: values.joining_date.format('YYYY-MM-DD'), // Format date correctly
//         });
//         message.success('User updated successfully!');
//       } else {
//         // Create a new user
//         await axios.post('/api/employees/', {
//           ...values,
//           joining_date: values.joining_date.format('YYYY-MM-DD'), // Format date correctly
//         });
//         message.success('User created successfully!');
//       }
//       fetchUsers();
//       setIsModalVisible(false);
//     } catch (error) {
//       console.error('Error saving user:', error);
//       message.error('Failed to save user.');
//     }
//   };

//   // Handle Delete User
//   const handleDelete = async (userId) => {
//     try {
//       await axios.delete(`/api/employees/${userId}/`);
//       message.success('User deleted successfully!');
//       fetchUsers();
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       message.error('Failed to delete user.');
//     }
//   };

//   // Open Modal for Edit or Add
//   const openModal = (user) => {
//     setEditingUser(user);
//     setIsModalVisible(true);
//   };

//   // Close Modal
//   const closeModal = () => {
//     setEditingUser(null);
//     setIsModalVisible(false);
//   };

//   const columns = [
//     {
//       title: 'Full Name',
//       dataIndex: 'full_name',
//       key: 'full_name',
//     },
//     {
//       title: 'Phone No',
//       dataIndex: 'phone_no',
//       key: 'phone_no',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Designation',
//       dataIndex: 'designation',
//       key: 'designation',
//     },
//     {
//       title: 'National ID',
//       dataIndex: 'national_id',
//       key: 'national_id',
//     },
//     {
//       title: 'Department',
//       dataIndex: 'department',
//       key: 'department',
//       render: (department) => <Tag color="blue">Dept {department}</Tag>,
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={status === 'active' ? 'green' : 'red'}>
//           {status.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Joining Date',
//       dataIndex: 'joining_date',
//       key: 'joining_date',
//       render: (date) => dayjs(date).format('YYYY-MM-DD'),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (text, record) => (
//         <Space>
//           <Button type="link" onClick={() => openModal(record)}>
//             Edit
//           </Button>
//           <Button type="link" danger onClick={() => handleDelete(record.id)}>
//             Delete
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Function to alternate row color
//   const rowClassName = (record, index) => {
//     return index % 2 === 0 ? 'even-row' : 'odd-row';
//   };

//   return (
//     <div>
//       <h2>User Management</h2>
//       <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: '16px' }}>
//         Add User
//       </Button>
//       <Table
//         columns={columns}
//         dataSource={users}
//         loading={loading}
//         rowKey="id"
//         bordered
//         rowClassName={rowClassName} // Apply alternating row class
//       />

//       <Modal
//         title={editingUser ? 'Edit User' : 'Add User'}
//         visible={isModalVisible}
//         onCancel={closeModal}
//         footer={null}
//       >
//         <Form
//           initialValues={
//             editingUser
//               ? {
//                   ...editingUser,
//                   joining_date: dayjs(editingUser.joining_date),
//                 }
//               : {}
//           }
//           onFinish={handleSave}
//           layout="vertical"
//         >
//           <Form.Item
//             name="full_name"
//             label="Full Name"
//             rules={[{ required: true, message: 'Please enter the full name' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="phone_no"
//             label="Phone No"
//             rules={[{ required: true, message: 'Please enter the phone number' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="designation"
//             label="Designation"
//             rules={[{ required: true, message: 'Please enter the designation' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="national_id"
//             label="National ID"
//             rules={[{ required: true, message: 'Please enter the national ID' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="department"
//             label="Department"
//             rules={[{ required: true, message: 'Please enter the department' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[{ required: true, message: 'Please select the status' }]}
//           >
//             <Select>
//               <Select.Option value="active">Active</Select.Option>
//               <Select.Option value="inactive">Inactive</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="joining_date"
//             label="Joining Date"
//             rules={[{ required: true, message: 'Please select the joining date' }]}
//           >
//             <DatePicker format="YYYY-MM-DD" />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Users;




import React, { useState } from 'react';
import { Tabs } from 'antd';
import Employees from './Employees';
import Designations from './Designations';
import Departments from './Departments';

const { TabPane } = Tabs;

const EmployeeManagement = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Designations" key="1">
        <Designations />
      </TabPane>
      <TabPane tab="Employees" key="2">
        <Employees />
      </TabPane>
      <TabPane tab="Departments" key="3">
        <Departments />
      </TabPane>
    </Tabs>
  );
};

export default EmployeeManagement;
