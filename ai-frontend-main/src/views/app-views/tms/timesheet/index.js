import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './layout.css'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import API from 'services/Api'; // Ensure this is correctly imported
const APP_PREFIX_PATH = '/app';
const Timesheet = () => {
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch timesheets from the API
  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await API('/timesheet-entries/', 'GET');
      if (response.status === 'success') {
        const formattedData = response.data.map(item => ({
          key: item.id, // Set key to the id from the response
          week: `Week of ${new Date(item.date).toLocaleDateString()}`, // Format the date for the "Week of"
          status: item.status, // Get the status directly
          totalhr: item.total_hours, // Map total_hours to totalhr
          submissionDate: item.date, // Use date as submissionDate
        }));
        setTimesheets(formattedData);
      } else {
        message.error('Failed to fetch timesheet data');
      }
    } catch (error) {
      message.error('An error occurred while fetching timesheet data');
      console.error(error); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchTimesheets();
  }, []);

 
  const handleCreateTimesheet = () => {
    navigate(`${APP_PREFIX_PATH}/views/timesheet/TimesheetForm`);
  };

 
  const handleEditTimesheet = (key) => {
    navigate(`${APP_PREFIX_PATH}/views/timesheet/TimesheetForm?id=${key}`);
  };

  
const getStatusTag = (status) => {
  switch (status) {
    case 'Approved':
      return (
        <Tag icon={<CheckCircleOutlined />} color="green" style={{ fontWeight: 'bold' }}>
          Approved
        </Tag>
      );
    case 'Pending':
      return (
        <Tag icon={<ClockCircleOutlined />} color="orange" style={{ fontWeight: 'bold' }}>
          Pending
        </Tag>
      );
    case 'Rejected':
      return (
        <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontWeight: 'bold' }}>
          Rejected
        </Tag>
      );
    case 'Submitted':
      return (
        <Tag icon={<CheckCircleOutlined />} color="blue" style={{ fontWeight: 'bold' }}>
          Submitted
        </Tag>
      );
    default:
      return (
        <Tag color="default" style={{ fontWeight: 'bold' }}>
          Unknown
        </Tag>
      );
  }
};


  // Table columns
  const columns = [
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
      sorter: (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate), // Sorting by date
      render: (week, record) =>
        record.status === 'Approved' ? (
          <span style={{ color: 'gray', cursor: 'not-allowed' }}>{week}</span>
        ) : (
          <a
            onClick={() => handleEditTimesheet(record.key)}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            {week}
          </a>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'Approved' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Rejected', value: 'Rejected' },
        { text: 'Submitted', value: 'Submitted' },
      ],
      onFilter: (value, record) => record.status === value, // Filtering by status
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Total Hrs',
      dataIndex: 'totalhr',
      key: 'totalhr',
      sorter: (a, b) => a.totalhr - b.totalhr, // Sorting by total hours
    },
    {
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      sorter: (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate), // Sorting by submission date
    },
  ];
  
  

  // Alternating row colors
  const rowClassName = (record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row');

  return (
    <div>
      <h2>My Timesheets</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTimesheet}>
          Create Timesheet
        </Button>
      </div>
      <Table
  dataSource={timesheets}
  columns={columns}
  rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
  pagination={false}
  loading={loading}
/>

    </div>
  );
};

export default Timesheet;
