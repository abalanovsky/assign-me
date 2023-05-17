import React from 'react';
import {DatePicker, Form, Input, Select, Radio} from "antd";
import {useSelector} from "react-redux";
import TextArea from "antd/es/input/TextArea";
import './EditTaskForm.css'
import dayjs from "dayjs";
function EditTaskForm(props) {
    const users = useSelector((state) => state.users)
    const editModalOptions = users.map((user) => ({
        value: user._id,
        label: user.name + ' ' + user.surname
    }))
    const createdBy = editModalOptions.find((user) => {
       return props.editForm.getFieldValue('createdBy') === user.value
    })
    const createdDate = dayjs(props.editForm.getFieldValue('created')).format('YYYY-MM-DD')

    return (
            <Form
                name="basic"
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 25,
                }}
                style={{
                    maxWidth: 900,
                }}
                form={props.editForm}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="Title"
                    rules={[{ required: true, message: 'Please input task title!' }]}>
                    <Input placeholder="Title"/>
                </Form.Item>
                <Form.Item name="description"
                           label="Description"
                           rules={[{ required: true, message: 'Please input task description!' }]}>
                    <TextArea rows={4} placeholder="Description"/>
                </Form.Item>
                <Form.Item name="deadline" label="Deadline">
                    <DatePicker placeholder="Deadline" />
                </Form.Item>
                <Form.Item name="status" label="Status">
                    <Radio.Group>
                        <Radio.Button value="todo" key="todo">Todo</Radio.Button>
                        <Radio.Button value="in-progress" key="in-progress"
                                      style={{ color: 'orange'}}>In progress</Radio.Button>
                        <Radio.Button value="finished" key="finished"
                                      style={{ color: 'green'}}>Finished</Radio.Button>
                        <Radio.Button value="overdue" key="overdue"
                                      disabled style={{ color: 'red'}}>Overdue</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="assignedTo" label="Assigned to">
                    <Select
                        showSearch
                        placeholder="Assigned to"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={editModalOptions}
                    />
                </Form.Item>
                <div className="additional-info-container">
                    <span>Created by {createdBy?.label} </span>
                    <span>Created  {createdDate}</span>
                </div>
            </Form>
    );
}
export default EditTaskForm;
