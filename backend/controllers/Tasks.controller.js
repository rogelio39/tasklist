import Task from '../models/Task.models.js';

export const createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;

    const task = new Task({
        title,
        description,
        assignedTo,
        createdBy: req.user._id,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        task.completed = req.body.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};


export const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (deleteTask) {
            res.json(deletedTask);
        }
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};
