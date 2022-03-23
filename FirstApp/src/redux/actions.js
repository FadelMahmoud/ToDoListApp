export const SET_TASKS = 'SET_TASKS';
export const SET_TASK_ID = 'SET_TASK_ID';
export const SET_TASK_FIRST_IMAGE = 'SET_TASK_FIRST_IMAGE';

export const setTasks = tasks => dispatch => {
    dispatch({
        type: SET_TASKS,
        payload: tasks,
    });
};

export const setTaskId = taskId => dispatch => {
    dispatch({
        type: SET_TASK_ID,
        payload: taskId,
    });
};

export const setTaskFirstImage = taskFirstImage => dispatch => {
    dispatch({
        type: SET_TASK_FIRST_IMAGE,
        payload: taskFirstImage,
    });
};