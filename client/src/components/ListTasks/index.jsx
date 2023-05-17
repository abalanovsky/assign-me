import React, {useEffect, useState} from 'react';
import './ListTasks.css'
import {Button, DatePicker, Form, Input, message, Modal, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {PlusCircleOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {createTask, deleteTask, getAllTasks, getUsersList, updateTask} from "../../api/api";
import {setTasks, setUsersList} from "../../redux/redux";
import dayjs from "dayjs";
import TasksColumn from "../TasksColumn";
import EditTaskForm from "../EditTaskForm";

function ListTasks() {
    const { TextArea } = Input;
    const dispatch = useDispatch()

    const usersList = useSelector((state) => state.users)
    const currUserId = useSelector((state) => state.user._id)
    const tasks = useSelector((state) => state.tasks)

    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showMyTasks, setShowMyTasks] = useState(false)
    const [creationFormValues, setCreationFormValues] = useState({
        name: '',
        description: '',
        status: 'todo',
        assignedTo: null,
        deadline: null
    })

    const [messageApi, contextHolder] = message.useMessage();
    const operationMessage = async (type, content) => {
       await messageApi.open({
            type,
            content,
            duration: 3,
            style: {
               marginTop: '20vh',
           },
        });
    };
    const [editForm] = Form.useForm();

    const loadTasks = () => {
        getAllTasks().then((response) => {
            dispatch(setTasks(response.data))
        }).catch(() => operationMessage('error','There was an error while loading tasks. Try again'))
    }
    const editTask = (type, id) => {
        if (type === 'start') {
            const editingTask = tasks.find((task) => task._id === id)
            editForm.setFieldsValue({ ...editingTask, deadline: dayjs(editingTask.deadline) });
            setIsEditModalOpen(true);
        } else if (type === 'finish') {
            updateTask(id, editForm.getFieldsValue())
                .then(async () => {
                    setIsEditModalOpen(false);
                    editForm.resetFields();
                    loadTasks();
                    await operationMessage('success','Task edited successfully')
                })
                .catch(() => operationMessage('error','There was an error while editing task. Try again'))
        } else if (type === 'cancel') {
            setIsEditModalOpen(false);
            editForm.resetFields();
        } else if (type === 'delete') {
            deleteTask(id)
                .then(async () => {
                    setIsEditModalOpen(false);
                    editForm.resetFields();
                    loadTasks();
                    await operationMessage('success','Task deleted successfully')
                })
                .catch(() => operationMessage('error','There was an error while deleting task. Try again'))
        }
    }

    useEffect(() => {
        getUsersList().then((response) => {
            dispatch(setUsersList(response.data))
        }).catch(e => console.error(e));
        loadTasks();
    }, []);

    const creationModalOptions = usersList.map((user) => ({
            value: user._id,
            label: user.name + ' ' + user.surname
    }))
    const showCreationModal = () => {
        setIsCreationModalOpen(true);
    };
    const handleCreationOk = () => {
        createTask({...creationFormValues, created: dayjs(), createdBy: currUserId })
            .then(async () => {
                setIsCreationModalOpen(false);
                form.resetFields();
                loadTasks();
                await operationMessage('success','Task created successfully')
            })
            .catch(() => operationMessage('error','There was an error while creating task. Try again'))
    };
    const handleCreationCancel = () => {
        form.resetFields();
        setIsCreationModalOpen(false);
    };
    const [form] = Form.useForm();

    return (
        <div className="list-tasks-container">
            {contextHolder}
            <div className="list-tasks-sidebar">
                <div className="heading-tasks-list">Tasks list</div>
                <div>
                    <Button type="primary" onClick={showCreationModal} icon={<PlusCircleOutlined />}
                            className="buttons-margin">
                        Create new task
                    </Button>
                    <Button type="primary" onClick={() => setShowMyTasks(!showMyTasks)}
                            icon={showMyTasks ? <TeamOutlined /> : <UserOutlined />}
                            className="buttons-margin">
                         {showMyTasks ? 'Show all' : 'Assigned to me'}
                    </Button>
                </div>
            </div>
                <div className="flex-columns-container">
                    <TasksColumn colType="todo" mine={showMyTasks} editTask={editTask}/>
                    <TasksColumn colType="in-progress" mine={showMyTasks} editTask={editTask}/>
                    <TasksColumn colType="finished" mine={showMyTasks} editTask={editTask}/>
                    <TasksColumn colType="overdue" mine={showMyTasks} editTask={editTask}/>
                </div>
            <Modal title="Create new task"
                   open={isCreationModalOpen}
                   onOk={handleCreationOk}
                   onCancel={handleCreationCancel}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    style={{
                        maxWidth: 900,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    onValuesChange={(newValue) => setCreationFormValues({ ...creationFormValues, ...newValue })}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input task title!' }]}>
                        <Input placeholder="Title"/>
                    </Form.Item>
                    <Form.Item name="description"
                               rules={[{ required: true, message: 'Please input task description!' }]}>
                        <TextArea rows={4} placeholder="Description"/>
                    </Form.Item>
                    <Form.Item name="deadline">
                        <DatePicker placeholder="Deadline"/>
                    </Form.Item>
                    <Form.Item name="assignedTo">
                        <Select
                            showSearch
                            placeholder="Assigned to"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={creationModalOptions}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Info "
                   open={isEditModalOpen}
                   onOk={() => editTask('finish', editForm.getFieldValue('_id'))}
                   onCancel={() => editTask('cancel')}
                   okText="Confirm"
                   footer={[
                       <Button onClick={() => editTask('cancel')}>
                           Cancel
                       </Button>,
                       <Button type="primary"
                               onClick={() => editTask('finish', editForm.getFieldValue('_id'))}>
                           Confirm
                       </Button>,
                       <Button
                           danger
                           onClick={() => editTask('delete', editForm.getFieldValue('_id'))}
                       >
                           Delete
                       </Button>,
                   ]}>
                <EditTaskForm editForm={editForm}/>
            </Modal>
        </div>
    );
}

export default ListTasks;
