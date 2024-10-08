import express from 'express';
import { createTask, deleteTask, getTasks, updateTaskStatus } from '../controllers/Tasks.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const TaskRouter = express.Router();

TaskRouter.route('/').get(protect, getTasks).post(protect, createTask);
TaskRouter.route('/:id').put(protect, updateTaskStatus);
TaskRouter.route('/:id').delete(protect, deleteTask);

export default TaskRouter;
