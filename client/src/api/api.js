import axios from "axios";

export const signIn = ({username, password}) => {
    return axios.get('http://localhost:5050/api/sign/in', { params: {username, password} });
}
export const signUp = ({name, surname, username, password}) => {
    return axios.post('http://localhost:5050/api/sign/up', { name, surname, username, password })
}
export const getUsersList = () => {
    return axios.get('http://localhost:5050/api/users/list', {})
}
export const createTask = (task) => {
    return axios.post('http://localhost:5050/api/tasks/create', task)
}
export const getAllTasks = () => {
    return axios.get('http://localhost:5050/api/tasks/load', {})
}
export const updateTask = (id, task) => {
    return axios.patch(`http://localhost:5050/api/tasks/update/${id}`, task)
}
export const deleteTask = (id) => {
    return axios.delete(`http://localhost:5050/api/tasks/delete/${id}`)
}
