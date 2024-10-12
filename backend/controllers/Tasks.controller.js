import Task from '../models/Task.models.js';

export const createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate, priority, notes } = req.body;

    try {
        // Crear una nueva tarea con los datos proporcionados
        const task = new Task({
            title,
            description,
            assignedTo,           // Usuario al que se le asigna la tarea
            createdBy: req.user._id, // Usuario que crea la tarea
            dueDate: dueDate ? new Date(dueDate) : null, // Fecha de vencimiento
            priority: priority || 'Medium', // Nivel de prioridad, por defecto 'Medium'
            notes, // Notas adicionales
        });

        // Guardar la tarea en la base de datos
        const createdTask = await task.save();

        // Responder con la tarea creada
        res.status(201).json(createdTask);
    } catch (error) {
        // Enviar error en caso de fallos
        res.status(500).json({ message: 'Error al crear la tarea', error });
    }
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



export const getTaskStats = async (req, res) => {
    const { start, end } = req.query;


    try {



        const taskCount = await Task.countDocuments({
            createdAt: { $gte: new Date(start), $lte: new Date(end) }
        });


        console.log("taskcount", taskCount)

        res.status(200).json({ taskCount });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las estadísticas' });
    }
};
