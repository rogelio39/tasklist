import express from 'express';
import { createTask, getTasks, updateTaskStatus } from '../controllers/Tasks.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const TaskRouter = express.Router();

TaskRouter.route('/').get(protect, getTasks).post(protect, createTask);
TaskRouter.route('/:id').put(protect, updateTaskStatus);

export default TaskRouter;
