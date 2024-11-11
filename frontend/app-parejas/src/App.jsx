import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/task-list/TaskList';
import PrivateRoute from './components/private-route/PrivateRoute';
import Main from './components/main/Main';
import NavBar from './components/navBar/NavBar';
import CalendarTask from './components/CalendarTasks/CalendarTask';
import TaskStats from './components/TaskStats/TaskStats';
import { TasksProvider } from './Context/TasksContext';
import Home from './pages/Inicio/Home';
import {  ToastContainer } from 'react-toastify';

// import TaskForm from './components/TaskForm/TaskForm';
const App = () => {
  return (
    <TasksProvider>
      <Router>
        <div className="app">
          <NavBar />
          <ToastContainer /> {/* Asegúrate de tener este contenedor para que se muestren las notificaciones */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tabla" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/tasks" element={<PrivateRoute component={TaskList} />} />
            <Route path="/calendar" element={<PrivateRoute component={CalendarTask} />} />
            <Route path="/stats" element={<PrivateRoute component={TaskStats} />} />
            {/* <Route path='/taskform' element={<TaskForm/>}/> */}
            {/* Ruta por defecto */}
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<Main />} />

          </Routes>
        </div>
      </Router>
    </TasksProvider>
  );
};

export default App;
