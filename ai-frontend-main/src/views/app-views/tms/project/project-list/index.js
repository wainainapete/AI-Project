import React, { useEffect, useRef, useState } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Radio, Button, Row, Col, Tooltip, Tag, Progress, Avatar, Menu, Card, Modal, Select, DatePicker, Form, Input, message, Spin, Dropdown } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, PlusOutlined , EllipsisOutlined} from '@ant-design/icons';
import ProjectListData from './ProjectListData';
import { 
	PaperClipOutlined, 
	CheckCircleOutlined, 
	ClockCircleOutlined,
	EyeOutlined, 
	EditOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import utils from 'utils';
import { COLORS } from 'constants/ChartConstant';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import API from 'services/Api';
import { useNavigate } from 'react-router-dom';

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';


const { Option } = Select;

const ItemAction = ({id, removeId}) => (
	<EllipsisDropdown 
		menu={
			<Menu>
				<Menu.Item key="0">
					<EyeOutlined />
					<span className="ml-2">View</span>
				</Menu.Item>
				<Menu.Item key="1">
					<EditOutlined />
					<span className="ml-2">Edit</span>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="2" onClick={() => removeId(id)}>
					<DeleteOutlined />
					<span className="ml-2">Delete Project</span>
				</Menu.Item>
			</Menu>
		}
	/>
)

const ItemHeader = ({name, category}) => (
	<div>
		<h4 className="mb-0">{name}</h4>
		<span className="text-muted">{category}</span>
	</div>
)

const ItemInfo = ({attachmentCount, completedTask, totalTask, statusColor, dayleft}) => (
	<Flex alignItems="center">
		<div className="mr-3">
			<Tooltip title="Attachment">
				<PaperClipOutlined className="text-muted font-size-md"/>
				<span className="ml-1 text-muted">{attachmentCount}</span>
			</Tooltip>
		</div>
		<div className="mr-3">
			<Tooltip title="Task Completed">
				<CheckCircleOutlined className="text-muted font-size-md"/>
				<span className="ml-1 text-muted">{completedTask}/{totalTask}</span>
			</Tooltip>
		</div>
		<div>
			<Tag color={statusColor !== "none"? statusColor : ''}>
				<ClockCircleOutlined />
				<span className="ml-2 font-weight-semibold">{dayleft} days left</span>
			</Tag>
		</div>
	</Flex>
)

const ItemProgress = ({progression}) => (
	<Progress percent={progression} strokeColor={getProgressStatusColor(progression)} size="small"/>
)

const ItemMember = ({member}) => (
	<>
		{member.map((elm, i) => (
				i <= 2?
			<Tooltip title={elm.name} key={`avatar-${i}`}>
				<Avatar size="small" className={`ml-1 cursor-pointer ant-avatar-${elm.avatarColor}`} src={elm.img} >
					{elm.img? '' : <span className="font-weight-semibold font-size-sm">{utils.getNameInitial(elm.name)}</span>}
				</Avatar>
			</Tooltip>
			:
			null
		))}
		{member.length > 3 ?
			<Tooltip title={`${member.length - 3} More`}>
				<Avatar size={25} className="ml-1 cursor-pointer bg-white border font-size-sm">
					<span className="text-gray-light font-weight-semibold">+{member.length - 3}</span>
				</Avatar>
			</Tooltip>
			:
			null
		}
	</>
)

const ListItem = ({ data, onView,  onEdit, onDelete }) => {
    const daysLeft = calculateDaysLeft(data.end_date);
    const progress = calculateProgress(data.start_date, data.end_date);

	console.log(daysLeft)

    const menu = (
        <Menu>
            <Menu.Item
                onClick={({ domEvent }) => {
                    domEvent.stopPropagation(); // Use domEvent to stop propagation
                    onEdit(data.id);
                }}
            >
                Edit
            </Menu.Item>
            <Menu.Item
                onClick={({ domEvent }) => {
                    domEvent.stopPropagation(); // Use domEvent to stop propagation
                    onDelete(data.id);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Card onClick={() => onView(data.id)} hoverable style={{ cursor: 'pointer' }}>
            {/* Menu Button at Top-Right */}
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Dropdown
                    overlay={menu}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            </div>

            {/* Card Content */}
            <Row align="middle">
                <Col xs={24} sm={20}>
                    <h4>{data.name}</h4>
                    <p>{data.description}</p>
                    <p>
                        <ClockCircleOutlined />{' '}
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </p>
                    <Progress percent={progress} />
                </Col>
                <Col xs={24} sm={4} style={{ textAlign: 'right' }}>
                    <Tag color={data.status === 'Active' ? 'green' : 'red'}>{data.status}</Tag>
                </Col>
            </Row>
        </Card>
    );
};

const GridItem = ({ data, onView,  onEdit, onDelete }) => {
    const daysLeft = calculateDaysLeft(data.end_date);
    const progress = calculateProgress(data.start_date, data.end_date);

    const menu = (
        <Menu>
            <Menu.Item
                onClick={({ domEvent }) => {
                    domEvent.stopPropagation(); // Use domEvent to stop propagation
                    onEdit(data.id);
                }}
            >
                Edit
            </Menu.Item>
            <Menu.Item
                onClick={({ domEvent }) => {
                    domEvent.stopPropagation(); // Use domEvent to stop propagation
                    onDelete(data.id);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Card onClick={() => onView(data.id)} hoverable style={{ cursor: 'pointer' }}>
            {/* Menu Button at Top-Right */}
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Dropdown
                    overlay={menu}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            </div>

            {/* Card Content */}
            <h4>{data.name}</h4>
            <p>{data.description}</p>
            <p>
                <ClockCircleOutlined />{' '}
                {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </p>
            <Progress percent={progress} />
            <Tag color={data.status === 'Active' ? 'green' : 'red'}>{data.status}</Tag>
        </Card>
    );
};


// Utility functions
const calculateDaysLeft = (endDate) => {
	const end = new Date(endDate);
	const now = new Date();
	return Math.ceil((end - now) / (1000 * 3600 * 24));
};

const calculateProgress = (startDate, endDate) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const now = new Date();
	const progress = Math.min(100, Math.floor(((now - start) / (end - start)) * 100));
	return progress > 0 ? progress : 0; // Ensure progress is not negative
};

// const ListItem = ({ data, removeId }) => (
// 	<Card>
// 		<Row align="middle">
//     		<Col xs={24} sm={24} md={8}>
// 				<ItemHeader name={data.name} category={data.category} />
// 			</Col>
// 			<Col xs={24} sm={24} md={6}>
// 				<ItemInfo 
// 					attachmentCount={data.attachmentCount}
// 					completedTask={data.completedTask}
// 					totalTask={data.totalTask}
// 					statusColor={data.statusColor}
// 					dayleft={data.dayleft}
// 				/>
// 			</Col>
// 			<Col xs={24} sm={24} md={5}>
// 				<ItemProgress progression={data.progression} />
// 			</Col>
// 			<Col xs={24} sm={24} md={3}>
// 				<div className="ml-0 ml-md-3">
// 					<ItemMember member={data.member}/>
// 				</div>
// 			</Col>
// 			<Col xs={24} sm={24} md={2}>
// 				<div className="text-right">
// 					<ItemAction id={data.id} removeId={removeId}/>
// 				</div>
// 			</Col>
// 		</Row>
// 	</Card>
// )

// const GridItem = ({ data, removeId, onView }) => (


//         // <Card onClick={() => onView(data.id)} hoverable style={{ cursor: 'pointer' }}>
//         //     {/* Menu Button at Top-Right */}
//         //     <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
//         //         <Dropdown
//         //             overlay={menu}
//         //             onClick={(e) => e.stopPropagation()}
//         //         >
//         //             <Button icon={<EllipsisOutlined />} />
//         //         </Dropdown>
//         //     </div>

//         //     {/* Card Content */}
//         //     <h4>{data.name}</h4>
//         //     <p>{data.description}</p>
//         //     <p>
//         //         <ClockCircleOutlined />{' '}
//         //         {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
//         //     </p>
//         //     <Progress percent={progress} />
//         //     <Tag color={data.status === 'Active' ? 'green' : 'red'}>{data.status}</Tag>
//         // </Card>



// 	<Card onClick={() => onView(data.id)} hoverable style={{ cursor: 'pointer' }}>
// 		<Flex alignItems="center" justifyContent="space-between">
// 			<ItemHeader name={data.name} category={data.category} />
// 			<ItemAction id={data.id} removeId={removeId}/>
// 		</Flex>
// 		<div className="mt-2">
// 			<ItemInfo 
// 				attachmentCount={data.attachmentCount}
// 				completedTask={data.completedTask}
// 				totalTask={data.totalTask}
// 				statusColor={data.statusColor}
// 				dayleft={data.dayleft}
// 			/>
// 		</div>
// 		<div className="mt-3">
// 			<ItemProgress progression={data.progression} />
// 		</div>
// 		<div className="mt-2">
// 			<ItemMember member={data.member}/>
// 		</div>
// 	</Card>
// )

const getProgressStatusColor = progress => {
	if(progress >= 80) {
		return COLORS[1]
	}
	if(progress < 60 && progress > 30) {
		return COLORS[3]
	}
	if(progress < 30) {
		return COLORS[2]
	}
	return COLORS[0]
}

const ProjectList = () => {

	const [view, setView] = useState(VIEW_GRID);
	const [list, setList] = useState(ProjectListData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);
    const currentUserId = localStorage.getItem('id');
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

	const onChangeProjectView = e => {
		setView(e.target.value)
	}

    const handleModalCancel = () => setIsModalVisible(false);

	const	deleteItem = id =>{
		const data = list.filter(elm => elm.id !== id)
		setList(data)
	}


    // Fetch departments
    // const fetchDepartments = async () => {
    //     try {
    //         const API_BASE_URL = process.env.REACT_APP_LIVE_URL;
    //         const response = await fetch(`${API_BASE_URL}/departments/list`);
    //         const data = await response.json();
    //         setDepartments(data);
    //     } catch {
    //         message.error('Failed to load departments.');
    //     }
    // };



    const fetchDepartments = async () => {
      try {
        const response = await API("/departments/list/", "get", {});
        if (response.status === "success") {
            console.log(response.data)
          setDepartments(response.data);
        } else {
          message.error("Failed to load departments");
        }
      } catch (error) {
        message.error(error.message);
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

    const handleOk = async (values) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                start_date: values.period_start_date.format('YYYY-MM-DD'),
                end_date: values.period_end_date.format('YYYY-MM-DD'),
                created_by: currentUserId,
                updated_by: currentUserId,
            };
            const response = await API('/projects-create/ ', 'POST', payload);
            setProjects([...projects, payload]);
            message.success('Project added successfully!');
            setIsModalVisible(false);
            formRef.current.resetFields();
        } catch {
            message.error('Failed to add project.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const { data } = await API('/projects/', 'GET', {});
              setProjects(data);
            // setProjects(ProjectListData);
        } catch {
            message.error('Failed to load projects.');
        } finally {
            setIsLoading(false);
        }

        // setIsLoading(false);
        //   setProjects(ProjectListData);
    };


    const handleView = (id) => navigate(`/app/project/details/${id}`);
    const handleEdit = (id) => navigate(`/app/apps/project/editproject/${id}`);

    const handleDeleteProject = async (id) => {
        Modal.confirm({
            title: 'Delete Project',
            content: 'Are you sure you want to delete this Project?',
            okType: 'danger',
            okText: "Yes, Delete",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await API(`projects/${id}/`, 'DELETE', {});
                    setProjects(projects.filter((proj) => proj.id !== id));
                    message.success('Project deleted successfully!');
                } catch {
                    message.error('Failed to delete project.');
                }
            },
        });
    };

    useEffect(() => {
        fetchDepartments();
        fetchProjects();
        fetchEmployees();
    }, []);


	return (
		<>
			<PageHeaderAlt className="border-bottom">
				<div className="container-fluid">
					<Flex justifyContent="space-between" alignItems="center" className="py-4">
						<h2>Projects</h2>
						<div>
							<Radio.Group defaultValue={VIEW_GRID} onChange={e => onChangeProjectView(e)}>
								<Radio.Button value={VIEW_GRID}><AppstoreOutlined /></Radio.Button>
								<Radio.Button value={VIEW_LIST}><UnorderedListOutlined /></Radio.Button>
							</Radio.Group>

							<Button type="primary" onClick={() => setIsModalVisible(true)} style={{ background: 'purple' }}>
								<PlusOutlined />
								<span>Add Project</span>
							</Button>
						</div>
					</Flex>
				</div>
			</PageHeaderAlt>
			{/* <div className={`my-4 ${view === VIEW_LIST? 'container' : 'container-fluid'}`}>
				{
					view === VIEW_LIST ?
					list.map(elm => <ListItem data={elm} removeId={id => deleteItem(id)} key={elm.id}/>)
					:
					<Row gutter={16}>
						{list.map(elm => (
							<Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm.id}>
								<GridItem data={elm} removeId={id => deleteItem(id)}/>
							</Col>
						))}
					</Row>
				}
			</div> */}


			<div className="container my-4">
                {isLoading ? (
                    <Spin tip="Loading projects..." />
                ) : view === VIEW_LIST ? (
                    projects.map((card) => (
                        <ListItem
                            key={card.id}
                            data={card}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDeleteProject}
                        />
                    ))
                ) : (
                    <Row gutter={16}>
                        {projects.map((card) => (
                            <Col key={card.id} xs={24} sm={12} lg={8}>
                                <GridItem
                                    data={card}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteProject}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>




            <Modal
                title="Create New Project"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                onOk={() => formRef.current.submit()}
                confirmLoading={isSubmitting}
                width={1000}
                style={{ top: 20 }}
                bodyStyle={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <Card>
                    <Form
                        ref={formRef}
                        layout="vertical"
                        onFinish={handleOk}
                    >
                        <Form.Item
                            name="name"
                            label="Project Name"
                            rules={[{ required: true, message: 'Please enter a project name.' }]}
                        >
                            <Input  placeholder="Project Name" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter a description.' }]}
                        >
                            <Input.TextArea  placeholder="Project description..." rows={10}/>
						</Form.Item>
						<Form.Item
							name="status"
							label="Status"
							rules={[{ required: true, message: 'Please select the project status' }]}
						>
							<Select>
								<Option value="Active">Active</Option>
								<Option value="Inactive">Inactive</Option>
							</Select>
						</Form.Item>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please select a department.' }]}
                        >
                            <Select loading={!departments.length}>
                                {departments.map((dept) => (
                                    <Option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="period_start_date"
                            label="Start Date"
                            rules={[{ required: true, message: 'Please select a start date.' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="period_end_date"
                            label="Due Date"
                            rules={[{ required: true, message: 'Please select an end date.' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Assign Employees"
                            name="assigned_employees"
                            rules={[{ required: true, message: 'Please assign at least one user!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Assign Users"
                                style={{ width: '100%' }}
                            >
                                {employees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.full_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Form>
                </Card>
            </Modal>
		</>
	)
}

export default ProjectList
