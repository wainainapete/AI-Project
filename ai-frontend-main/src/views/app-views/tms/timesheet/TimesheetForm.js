import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Dropdown, Menu, Spin, Modal, Select, message, notification } from 'antd';
import { EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useNavigate } from 'react-router-dom';
import API from 'services/Api';

dayjs.extend(isoWeek);

const TimesheetForm = () => {
  const navigate = useNavigate();
  const [weekName, setWeekName] = useState('');
  const [visibleDays, setVisibleDays] = useState({});
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [submittedTasks, setSubmittedTasks] = useState(new Set()); // Track submitted tasks
  const handleTaskNameChange = (day, taskId, newName) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, name: newName }; // Update the name of the specific task
        }
        return task;
      });
      return { ...prevTasks, [day]: updatedTasks };
    });
  };
  
  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API('/tasks/', 'GET'); // Assuming API endpoint to fetch tasks
        if (response.status === 200) {
          setTasks(response.data); // Store the tasks fetched from the backend
        } else {
          message.error('Failed to fetch tasks.');
        }
      } catch (error) {
        message.error('Error fetching tasks.');
      }
    };
    fetchTasks();
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i % 12 || 12;
        const minute = j.toString().padStart(2, '0');
        const period = i < 12 ? 'AM' : 'PM';
        times.push(`${hour}:${minute} ${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const calculateHours = (start, end) => {
    if (start && end) {
      const startTime = dayjs(start, 'hh:mm A');
      const endTime = dayjs(end, 'hh:mm A');
      return endTime.diff(startTime, 'hour', true).toFixed(2);
    }
    return '';
  };

  const calculateTotalHours = (tasks) => {
    return tasks.reduce((total, task) => {
      const hours = calculateHours(task.startTime, task.endTime);
      return total + (parseFloat(hours) || 0);
    }, 0).toFixed(2);
  };
  const handleTimeChange = (day, taskId, type, value) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks[day].map((task) => {
        if (task.id === taskId) {
          return { ...task, [type]: value }; // Update either startTime or endTime
        }
        return task;
      });
      return { ...prevTasks, [day]: updatedTasks };
    });
  };
  
  const onDatesChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setStartDate(start);
      setWeekName(`Week ${dayjs(start).isoWeek()} (${start.format('MMM D')} - ${end.format('MMM D')})`);
      const daysInRange = [];
      for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, 'day')) {
        daysInRange.push(date.format('dddd'));
      }
      const initialTasks = daysInRange.reduce((acc, day) => ({ ...acc, [day]: [{ id: 1, startTime: '', endTime: '' }] }), {});
      const initialVisibleDays = daysInRange.reduce((acc, day) => ({ ...acc, [day]: false }), {});
      setTasks(initialTasks);
      setVisibleDays(initialVisibleDays);
    }
  };

  const toggleDayVisibility = (day) => {
    setVisibleDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const addTaskRow = (day) => {
    setTasks((prev) => ({
      ...prev,
      [day]: [...prev[day], { id: prev[day].length + 1, startTime: '', endTime: '' }],
    }));
  };

  const deleteTaskRow = (day, id) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((task) => task.id !== id),
    }));
  };

  const handleDelete = (day, taskId) => {
    setTaskToDelete({ day, taskId });
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTaskRow(taskToDelete.day, taskToDelete.taskId);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const submitTask = async (day, task) => {
    setIsSubmitting(true);

    const startTime = task.startTime ? dayjs(task.startTime, 'hh:mm A').format('HH:mm:ss') : '';
    const endTime = task.endTime ? dayjs(task.endTime, 'hh:mm A').format('HH:mm:ss') : '';
    const totalHours = calculateHours(task.startTime, task.endTime);

    const taskDate = startDate
      ? startDate
          .add(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day), 'day')
          .format('YYYY-MM-DD')
      : '';

    const payload = {
      employee: 4,
      time_period: 'weekly',
      status: 'Submitted',
      start_time: startTime,
      end_time: endTime,
      total_hours: totalHours,
      task: task.id, // Use the task ID here
      description: task.description || '',
      date: taskDate,
    };

    try {
      const response = await API('/timesheet-entries/', 'POST', payload);

      if (response.status === 201) {
        // Update the task with the backend response data
        const updatedTask = response.data;
        
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((t) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask, submitted: true } : t
          );
          return updatedTasks;
        });

        setSubmittedTasks((prev) => new Set(prev.add(`${day}-${updatedTask.id}`)));

        notification.success({
          message: 'Task Successfully Submitted',
          description: `Task for ${day} has been submitted successfully.`,
          placement: 'topRight',
          duration: 3,
        });
      } else {
        const errorData = response.data || {};
        message(`Submit task: ${errorData.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const customIndicator = <LoadingOutlined style={{ fontSize: 50, color: '#1890ff' }} spin />;

  return (
    <>
      <Spin
        spinning={isSubmitting}
        tip={'Submitting...'}
        indicator={customIndicator}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Select Week"
            name="week"
            rules={[{ required: true, message: 'Please select a week!' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} onChange={onDatesChange} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Timesheet Name">
            <Input value={weekName} readOnly placeholder="Week name will be generated here" style={{ background: '#f5f5f5' }} />
          </Form.Item>

          <h3>Task Details</h3>
          {Object.keys(visibleDays).map((day) => (
            <div key={day}>
              <Button type="link" onClick={() => toggleDayVisibility(day)}>
                {visibleDays[day] ? `Hide ${day}` : `Show ${day}`}
              </Button>
              {visibleDays[day] && (
                <>
                  {tasks[day].map((task, index) => (
                    <Row
                      gutter={16}
                      key={`${day}-${task.id}`}
                      align="middle"
                      style={{
                        padding: '8px 0',
                        background: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      }}
                    >
                      <Col span={2}>
                        <Form.Item label="Date">
                          <Input
                            readOnly
                            value={startDate
                              ? startDate
                                  .add(
                                    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day),
                                    'day'
                                  )
                                  .format('MMM D')
                              : ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          name={`start_time_${day}_${task.id}`}
                          label="Start Time"
                          rules={[{ required: true, message: 'Start time is required!' }]}
                        >
                          <Select
                            value={task.startTime}
                            onChange={(value) => handleTimeChange(day, task.id, 'startTime', value)}
                            showSearch
                            placeholder="Select or enter time"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                          >
                            {timeOptions.map((time) => (
                              <Select.Option key={time} value={time}>
                                {time}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          name={`end_time_${day}_${task.id}`}
                          label="End Time"
                          rules={[{ required: true, message: 'End time is required!' }]}
                        >
                          <Select
                            value={task.endTime}
                            onChange={(value) => handleTimeChange(day, task.id, 'endTime', value)}
                            showSearch
                            placeholder="Select or enter time"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                          >
                            {timeOptions.map((time) => (
                              <Select.Option key={time} value={time}>
                                {time}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      {
  tasks.map((task) => (
    <div key={task.id}>
      <Row gutter={16} align="middle" style={{ padding: '8px 0' }}>
        <Col span={5}>
          <Form.Item
            name={`task_${day}_${task.id}`} // Dynamically name each form item with the day and task id
            label="Task"
            initialValue={task.name} // Set the initial value to the task name
          >
            <Input
              placeholder="Enter task"
              value={task.name} // Set the value to task.name to reflect the current task name
              onChange={(e) => handleTaskNameChange(day, task.id, e.target.value)} // Handle name changes if needed
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  ))
}

                      <Col span={6}>
                        <Form.Item name={`description_${day}_${task.id}`} label="Description">
                          <Input placeholder="Enter description" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label="Hours">
                          <Input readOnly value={calculateHours(task.startTime, task.endTime)} />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key="delete" onClick={() => handleDelete(day, task.id)}>
                                Delete
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={['click']}
                        >
                          <Button icon={<EllipsisOutlined />} style={{ marginRight: '8px', marginBottom: '0px' }} />
                        </Dropdown>
                        <Button
                          type="primary"
                          onClick={() => submitTask(day, task)}
                          loading={isSubmitting}
                          disabled={submittedTasks.has(`${day}-${task.id}`) || !task.startTime || !task.endTime}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Row
                    gutter={16}
                    style={{ padding: '8px 0', background: '#f0f0f0', fontWeight: 'bold' }}
                  >
                    <Col span={19} style={{ textAlign: 'right' }}>
                      Total Hours
                    </Col>
                    <Col span={5}>
                      <Input readOnly value={calculateTotalHours(tasks[day])} />
                    </Col>
                  </Row>
                  <Button type="dashed" onClick={() => addTaskRow(day)} style={{ marginBottom: '16px' }}>
                    Add Task for {day}
                  </Button>
                </>
              )}
            </div>
          ))}
        </Form>
      </Spin>

      <Modal
        title="Confirm Deletion"
        visible={showModal}
        onOk={confirmDelete}
        onCancel={cancelDelete}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </>
  );
};

export default TimesheetForm;
