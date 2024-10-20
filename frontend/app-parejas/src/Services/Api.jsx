


const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL

// Obtener todas las tareas
export const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${URL1}/api/tasks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Error fetching tasks");
    }

    const data = await res.json();
    return data;
};


export const fetchTasksForDate = async (date) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${URL1}/api/tasks/tasks-by-date?date=${date.toISOString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error al obtener las tareas para la fecha seleccionada:', error);
    }
};



// Crear nueva tarea
export const createTask = async (task, selectedDate) => {

    const token = localStorage.getItem("token");
    const res = await fetch(`${URL1}/api/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...task, 
            dueDate: selectedDate}),
    });

    if (!res.ok) {
        throw new Error("Error creating task");
    }

    const data = await res.json();
    return data;
};

// Actualizar una tarea existente
export const updateTask = async (updatedTask) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${URL1}/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
        throw new Error("Error updating task");
    }

    const data = await res.json();
    return data;
};

// Eliminar una tarea
export const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${URL1}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Error deleting task");
    }
};
