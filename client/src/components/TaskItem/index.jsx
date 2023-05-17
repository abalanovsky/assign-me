import React from 'react';
import {Button, Card} from "antd";
import {ClockCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import './TaskItem.css'

function TaskItem({ task, editTask }) {
    return (
        <div className="task-item-container">
            <Card
                title={task.name}
                extra={
                <Button type="primary" shape="circle"
                        icon={<InfoCircleOutlined />}
                        onClick={() => editTask('start', task._id)}
                />}
            >
                <div>{task.description}</div>
                <div style={{padding: 5}}>
                    <ClockCircleOutlined /> Deadline {dayjs(task.deadline).format('DD MMM')}</div>
            </Card>
        </div>
    );
}

export default TaskItem;
