


const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL

// Obtener todas las tareas
const fetchTasks = async () => {
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

// Función para programar el recordatorio
const scheduleEmailReminder = async (email, task) => {
    await fetch(`${URL1}/api/email/schedule-reminder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, task })
    });
};
const fetchTasksForDate = async (date) => {
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
const createTask = async (task) => {

    const token = localStorage.getItem("token");
    const res = await fetch(`${URL1}/api/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!res.ok) {
        throw new Error("Error creating task");
    }

    const data = await res.json();
    return data;
};

// Actualizar una tarea existente
const updateTask = async (updatedTask) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${URL1}/api/tasks/${updatedTask._id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
        throw new Error("Error updating task");
    }

    await res.json();
    return 'ok';
};

const updateTasksTatus = async (updatedTask) => {

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
const deleteTask = async (id) => {
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

    const data = await res.json();
    return data;
};



//AUTH API


const Login = async (credentialResponse) => {
    try {
        const response = await fetch(`${URL1}/api/users/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: credentialResponse.credential })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Almacenar el JWT del backend
            console.log('Inicio de sesión exitoso');
            return data.token;
        } else {
            console.log('Error en el inicio de sesión:', data.message);
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
    }
};


export {Login, createTask,  deleteTask, updateTasksTatus, updateTask, fetchTasksForDate, scheduleEmailReminder, fetchTasks}