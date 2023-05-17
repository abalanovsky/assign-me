import { reducer, setCurrUser, unsetCurrUser, setUsersList, setTasks } from './redux';

describe('reducer', () => {
    it('should set current user', () => {
        const initialState = {
            user: {
                name: '',
                surname: '',
                password: '',
                username: '',
                _id: null,
            },
            users: [],
            tasks: [],
        };
        const newUser = {
            name: 'John',
            surname: 'Doe',
            password: 'password',
            username: 'jdoeuser',
            _id: '123',
        };
        const action = setCurrUser(newUser);
        const newState = reducer(initialState, action);
        expect(newState.user).toEqual(newUser);
    });

    it('should unset current user', () => {
        const initialState = {
            user: {
                name: 'John',
                surname: 'Doe',
                password: 'password',
                username: 'johndoe',
                _id: '123',
            },
            users: [],
            tasks: [],
        };
        const action = unsetCurrUser();
        const newState = reducer(initialState, action);
        expect(newState.user).toEqual({
            name: '',
            surname: '',
            username: '',
            password: '',
            _id: null,
        });
    });

    it('should set users list', () => {
        const initialState = {
            user: {
                name: '',
                surname: '',
                password: '',
                username: '',
                _id: null,
            },
            users: [],
            tasks: [],
        };
        const userList = [
            { name: 'John', surname: 'Doe', username: 'jdoe', _id: '1' },
            { name: 'Jane', surname: 'Smith', username: 'jsmith', _id: '2' },
        ];
        const action = setUsersList(userList);
        const newState = reducer(initialState, action);
        expect(newState.users).toEqual(userList);
    });

    it('should set tasks', () => {
        const initialState = {
            user: {
                name: '',
                surname: '',
                password: '',
                username: '',
                _id: null,
            },
            users: [],
            tasks: [],
        };
        const taskList = [
            { id: '1', title: 'Task 1' },
            { id: '2', title: 'Task 2' },
        ];
        const action = setTasks(taskList);
        const newState = reducer(initialState, action);
        expect(newState.tasks).toEqual(taskList);
    });
});
