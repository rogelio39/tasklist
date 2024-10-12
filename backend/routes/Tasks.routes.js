import express from 'express';
import { createTask, deleteTask, getTasks, updateTaskStatus, getTaskStats } from '../controllers/Tasks.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const TaskRouter = express.Router();

TaskRouter.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);
TaskRouter.get('/stats',protect, getTaskStats);
TaskRouter.route('/:id')
    .put(protect, updateTaskStatus)
    .delete(protect, deleteTask);

export default TaskRouter;
