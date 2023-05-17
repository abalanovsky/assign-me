import React, {useState} from 'react';
import {useSelector} from "react-redux";
import './TasksColumn.css'
import TaskItem from "../TaskItem";
import {Button, Card, Input, Skeleton} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

function TasksColumn({ colType, editTask, mine }) {
    const { Search } = Input;

    const tasks = useSelector((state) => state.tasks)
    const currUser = useSelector((state) => state.user)

    const [search, setSearch] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')

    const filteredTasks = tasks.filter(({ status }) => status === colType).filter((task) =>
    task.name.includes(search) || task.description.includes(search))
        .filter((task) => mine ? task.assignedTo === currUser._id : true)
        .sort((a,b) => {
        if (sortDirection === 'asc') {
            return dayjs(a.created).isBefore(b.created) ? 1 : -1
        } else {
            return dayjs(a.created).isAfter(b.created) ? 1 : -1
        }
    })

    const descDictionary = {
        todo: 'Todo',
        'in-progress': 'In progress',
        finished: 'Finished',
        overdue: 'Overdue'

    }

    return (
        <div className={`column-container background-${colType}`}>
            <div className="search-sort-container">
                <Search placeholder="input search text" onSearch={setSearch} style={{ width: 200, marginRight: 5 }} />
                <Button type={sortDirection === 'asc' ? 'primary' : ''}
                        shape="circle"
                        size="small"
                        icon={<DownOutlined />}
                        onClick={() => setSortDirection('asc')}
                />
                <Button type={sortDirection === 'desc' ? 'primary' : ''}
                        shape="circle"
                        size="small"
                        icon={<UpOutlined />}
                        onClick={() => setSortDirection('desc')}
                />
            </div>
            <div className={`column-heading ${colType}`}>{descDictionary[colType]}</div>
            <div className="column-tasks-container">
                {
                    (filteredTasks.length === 0) ? <Card
                            title="No tasks"
                        >
                            <span><Skeleton /></span>
                        </Card> :
                          filteredTasks.map(task => <TaskItem task={task} editTask={editTask} key={task._id}/>)
                }
            </div>
        </div>
    );
}

export default TasksColumn;
