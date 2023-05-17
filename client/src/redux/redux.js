import {configureStore, createAction, createReducer} from "@reduxjs/toolkit";

const defaultState = {
    user: {
        name: '',
        surname: '',
        password: '',
        username: '',
        _id: null,
    },
    users: [],
    tasks: []
}
export const setCurrUser = createAction('SET_CURR_USER')
export const unsetCurrUser = createAction('UNSET_CURR_USER')
export const setUsersList = createAction('SET_USERS_LIST')
export const setTasks = createAction('SET_TASKS')

export const reducer = createReducer(defaultState, builder => {
    builder
        .addCase(setCurrUser, (state,action) => {
            state.user = {...action.payload}
        })
        .addCase(unsetCurrUser, (state,action) => {
            state.user = {
                name: '',
                surname: '',
                username: '',
                password: '',
                _id: null
            }
        })
        .addCase(setUsersList, (state, action) => {
            state.users = [];
            state.users.push(...action.payload);
        })
        .addCase(setTasks, (state,action) => {
            state.tasks = []
            state.tasks.push(...action.payload)
        })
})

export const store = configureStore({reducer})
