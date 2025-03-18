import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Progress,
  Dropdown,
  Menu,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  message,
  Checkbox,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import API from 'services/Api';



const { Title } = Typography;
const { Option } = Select;

// Initial tasks
const initialTasks = [
  {
    id: 1,
    name: "Design the project layout",
    description: "Design the project layout",
    status: "In Progress",
    progress: 70,
    end_date: "2025-02-01",
  },
  {
    id: 2,
    name: "Implement authentication module",
    description: "Design the project layout",
    status: "Completed",
    progress: 100,
    end_date: "2025-01-15",
  },
  {
    id: 3,
    name: "Setup database schema",
    description: "Design the project layout",
    status: "Pending",
    progress: 0,
    end_date: "2025-02-10",
  },
];

// Status color map
const statusColors = {
  Completed: "green",
  "In Progress": "blue",
  Pending: "orange",
};


// Task component
const ProjectTasks = () => {
  const navigate = useNavigate(); 
  // const [tasks, setTasks] = useState(initialTasks);
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const formRef = useRef(null);


  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data } = await API('/projects/', 'GET', {});
      setProjects(data);
    } catch {
      message.error('Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await API("/employee/list/", "get", {});
      if (response.status === "success") {
        setEmployees(response.data);
      } else {
        message.error("Failed to load designations");
      }
    } catch (error) {
      message.error(error.message);
    }
  };


  const fetchTasks = async () => {
    try {
      const response = await API("/tasks/", "get", {});
      if (response.status === "success") {
        setTasks(response.data);
      } else {
        message.error("Failed to load Tasks");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchTasks();
  }, []);


  // Sample list of users for assigning tasks
  const users = ['Alice', 'Bob', 'Charlie', 'David'];

  // Show modal for adding a new task
  const showModal = (task = null) => {
    setIsModalVisible(true);
    // if (task) {
    //   setEditingTaskId(task.id); // If editing, store the task ID

    // // formRef.current.setFieldsValue({
    // //     name: task.name,
    // //     description: task.description,
    // //     // start_date: moment(task.startDate), // Make sure this is a moment object
    // //     // end_date: moment(task.endDate), // Make sure this is a moment object
    // //     status: task.status,
    // //     assignedUsers: task.assignedUsers,
    // //   });
    // }
  };


  // Close modal without saving
  const handleCancel = () => {
    setIsModalVisible(false);
    formRef.current.resetFields();
    setEditingTaskId(null); // Reset editing task ID
  };

  const dropdownMenu = (task) => (
    <Menu>
      <Menu.Item
        onClick={({ domEvent }) => {
          domEvent.stopPropagation(); // Use domEvent to stop propagation
          showModal(task);
        }} >
        <EditOutlined />     Edit
      </Menu.Item>
      <Menu.Item
        onClick={({ domEvent }) => {
          domEvent.stopPropagation(); // Use domEvent to stop propagation
          handleDeleteTask(task.id);
        }} >
        <DeleteOutlined />    Delete
      </Menu.Item>
    </Menu>
  );


  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };


  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        // console.log("Values: ", values);
        // return

        const payload = {
          name: values.name,
          description: values.description,
          start_date: values.start_date.format('YYYY-MM-DD'),
          end_date: values.end_date.format('YYYY-MM-DD'),
          status: values.status,
          project: values.project,
          assignedUsers: values.assignedUsers,
        };

        API("/tasks-create/", "POST", payload)
          .then((response) => {
            if (response.status === "success") {
              message.success(
                `Task added successfully`
              );
              // console.log("Employees: ", payload)
              setTasks([...tasks, payload]);
            } else {
              message.error("Failed to add Task");
            }
          })
          .catch(() => {
            message.error("Failed to add Task");
          });

        // formRef.current.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };


  const handleCardClick = (task_id) => {
    console.log(`Task ${task_id} Clicked`);
    navigate(`/app/task/view/${task_id}`);
  };

  return (
    <div>
      <Card
        title={<Title level={4}>Project Tasks</Title>}
        // style={{ margin: "20px auto", maxWidth: "1000px" }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Task
          </Button>
        }
        bodyStyle={{ padding: "20px" }}
      >
        <Row gutter={[16, 16]}>
          {tasks.map((task) => (
            <Col key={task.id} xs={24} sm={12} md={8}>
              <Card
                style={{
                  border: `1px solid ${statusColors[task.status]}`,
                  // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
                }}

                hoverable
                onClick={() => handleCardClick(task.id)} 
              >

                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Dropdown
                    onClick={(e) => e.stopPropagation()}
                    overlay={dropdownMenu(task)} trigger={['hover']}
                  >

                    <Button icon={<EllipsisOutlined />} />
                  </Dropdown>
                </div>
                
                <Space direction="vertical" size="small">
                  <Title level={5}>{task.name}</Title>
                  <Tag color={statusColors[task.status]}>{task.status}</Tag>
                  <Typography.Text type="secondary">
                    End Date : {task.end_date}
                  </Typography.Text>
                  <div style={{ textAlign: "center" }}>
                    <Progress
                      type="circle"
                      percent={task.progress}
                      width={60}
                      status={
                        task.status === "Completed"
                          ? "success"
                          : task.status === "Pending"
                          ? "exception"
                          : "active"
                      }
                      format={() =>
                        task.status === "Completed" ? (
                          <CheckCircleOutlined
                            style={{ color: statusColors.Completed }}
                          />
                        ) : task.status === "Pending" ? (
                          <CloseCircleOutlined
                            style={{ color: statusColors.Pending }}
                          />
                        ) : (
                          <ClockCircleOutlined
                            style={{ color: statusColors["In Progress"] }}
                          />
                        )
                      }
                    />
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Modal for adding a new task */}
      <Modal
        title={editingTaskId ? 'Edit Task' : 'Add New Task'}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        style={{ top: 20 }}
        okText="Submit"
        cancelText="Cancel"
        onOk={handleOk}
        bodyStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        destroyOnClose
      >
        <Card>
          <Form
            ref={formRef}
            layout="vertical"
            onFinish={handleOk}
          >

            <Form.Item
              label="Task Name"
              name="name"
              rules={[{ required: true, message: 'Please input the task title!' }]}
            >
              <Input placeholder="Task name" />
            </Form.Item>

            <Form.Item label="Project" name="project">
              <Select placeholder="Choose project" >
                {Array.isArray(projects) &&
                  projects.length > 0 ? (
                  projects.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No projects Defined</Option>
                )}
              </Select>
            </Form.Item>


            <Form.Item
              label="Task Description"
              name="description"
              rules={[{ required: true, message: 'Please input the task description!' }]}
            >
              <Input.TextArea placeholder="Task Description" rows={8} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Start Date"
                  name="start_date"
                  rules={[{ required: true, message: "Please select a start date!" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Start Time"
                  name="start_time"
                  rules={[{ required: true, message: "Please select a start time!" }]}
                >
                  <TimePicker style={{ width: "100%" }} format={"HH:mm"} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="End Date"
                  name="end_date"
                  rules={[{ required: true, message: "Please select an end date!" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="End Time"
                  name="end_time"
                  rules={[{ required: true, message: "Please select an end time!" }]}
                >
                  <TimePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status!" }]}
            >
              <Select
                placeholder="Select Task Status"
                style={{ width: '100%' }}
                defaultValue="Pending"
              >
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Canceled">Canceled</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="Task Priority"
              rules={[{ required: true, message: "Please set the task priority!" }]}
            >
              <Select placeholder="Select Task Priority" style={{ width: '100%' }}>
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
            </Form.Item>

            {/* Assign Users Dropdown */}
            <Form.Item
              label="Assign Users"
              name="assignedUsers"
              rules={[{ required: true, message: 'Please assign at least one user!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Assign Users"
                style={{ width: '100%' }}
              >
                {Array.isArray(employees) &&
                  employees.length > 0 ? (
                  employees.map((employee) => (
                    <Option key={employee.id} value={employee.id}>
                      {employee.full_name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No Employees Defined</Option>
                )}
              </Select>
            </Form.Item>

            <Form.List name="deliverables">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={16}>
                      <Col span={20}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true, message: 'Please input deliverable!' }]}
                        >
                          <Input placeholder="Deliverable" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'checked']}
                          fieldKey={[field.fieldKey, 'checked']}
                          valuePropName="checked"
                        >
                          <Checkbox>Done</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Button type="link" onClick={() => remove(field.name)}>Remove</Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    Add Deliverable
                  </Button>
                </>
              )}
            </Form.List>

          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default ProjectTasks;
