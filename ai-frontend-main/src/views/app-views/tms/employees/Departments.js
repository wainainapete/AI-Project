import React, { useState, useEffect } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import { Dropdown, Menu, Modal, Form, Input, Button, message, Spin } from "antd";
import { EllipsisOutlined, PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import API from "services/Api";
import "./DepartmentTree.css";

const DepartmentTree = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [form] = Form.useForm();

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  // Store initial position for reset
  const initialPosition = { x: 0, y: 0 };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await API("/departments/list/", "GET");
      if (response.status === "success") {
        setDepartments(buildDepartmentTree(response.data));
      } else {
        message.error("Failed to fetch department data");
      }
    } catch (error) {
      message.error("Error fetching department data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buildDepartmentTree = (flatList) => {
    const departmentMap = {};
    const rootDepartments = [];

    flatList.forEach((dept) => {
      departmentMap[dept.id] = { ...dept, children: [] };
    });

    flatList.forEach((dept) => {
      if (dept.parent_id) {
        departmentMap[dept.parent_id]?.children.push(departmentMap[dept.id]);
      } else {
        rootDepartments.push(departmentMap[dept.id]);
      }
    });

    return rootDepartments;
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPosition({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setCurrentPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const handleActionModal = (type, node = null) => {
    setModalType(type);
    setSelectedNode(node);
    setModalVisible(true);
    form.setFieldsValue(node ? { name: node.name, email: node.email } : {});
  };

  const handleModalSubmit = () => {
    form.validateFields().then(({ name, email }) => {
      if (modalType === "Add") {
        createDepartment(selectedNode?.id, name, email);
      } else {
        editDepartment(selectedNode.id, name, email);
      }
      setModalVisible(false);
    });
  };

  const createDepartment = async (parentId, name, email) => {
    try {
      const response = await API("/create-department/", "POST", { parent_id: parentId, name, email });
      if (response.status === "success") {
        message.success("Department added successfully!");
        fetchDepartments();
      } else {
        message.error("Failed to add department");
      }
    } catch (error) {
      message.error("Error adding department");
      console.error(error);
    }
  };

  const editDepartment = async (id, name, email) => {
    try {
      const response = await API(`/departments/${id}/`, "PUT", { name, email });
      if (response.status === "success") {
        message.success("Department updated successfully!");
        fetchDepartments();
      } else {
        message.error("Failed to update department");
      }
    } catch (error) {
      message.error("Error updating department");
      console.error(error);
    }
  };

  const deleteDepartment = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await API(`/departments/${id}/`, "DELETE");
          if (response.status === "success") {
            message.success("Department deleted successfully!");
            fetchDepartments();
          } else {
            message.error("Failed to delete department");
          }
        } catch (error) {
          message.error("Error deleting department");
          console.error(error);
        }
      },
    });
  };

  const renderTree = (node) => (
    <ArcherElement
      key={node.id}
      id={`department-${node.id}`}
      relations={node.children.map((child) => ({
        targetId: `department-${child.id}`,
        sourceAnchor: "top",
        targetAnchor: "top",
      }))}
    >
      <div className="tree-node">
        <div className="department-card">
          <p className="department-name">{node.name}</p>
          <p className="department-email">{node.email}</p>
          <p className="department-employees">{node.employee_count} employees</p>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleActionModal("Add", node)}>Add Sub-Department</Menu.Item>
                <Menu.Item onClick={() => handleActionModal("Edit", node)}>Edit</Menu.Item>
                <Menu.Item onClick={() => deleteDepartment(node.id)} danger>
                  <DeleteOutlined /> Delete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <EllipsisOutlined style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }} />
          </Dropdown>
        </div>
        {node.children.length > 0 && <div className="tree-children">{node.children.map(renderTree)}</div>}
      </div>
    </ArcherElement>
  );

  const customIndicator = <LoadingOutlined style={{ fontSize: 50, color: "#1890ff" }} spin />;

  if (loading) return <Spin tip="Loading departments..." size="large" indicator={customIndicator} />;

  return (
    <div
      className="tree-container"
      style={{
        transform: `scale(${zoom}) translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        transformOrigin: "top left",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <ArcherContainer strokeColor="purple" strokeWidth={2} svgContainerStyle={{ overflow: "visible" }}>
        <div className="tree">
          {departments.length > 0 && <div className="parent-node">{departments.map(renderTree)}</div>}
        </div>
      </ArcherContainer>

      <div className="control-buttons">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleActionModal("Add", null)}>
          Add New Department
        </Button>
        <Button onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}>Zoom In</Button>
        <Button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}>Zoom Out</Button>
        <Button onClick={() => setZoom(1)}>Reset Zoom</Button>
        <Button onClick={() => setCurrentPosition(initialPosition)}>Reset Pan</Button>
      </div>

      <Modal title={`${modalType} Department`} open={modalVisible} onOk={handleModalSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="Department Name" name="name" rules={[{ required: true, message: "Please enter the department name" }]}>
            <Input placeholder="Enter department name" />
          </Form.Item>
          <Form.Item label="Department Email" name="email" rules={[{ required: true, message: "Please enter the department email" }]}>
            <Input type="email" placeholder="Enter department email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentTree;
