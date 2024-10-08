import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/task-list/TaskList';
import PrivateRoute from './components/private-route/PrivateRoute';
import Main from './components/main/Main';
import NavBar from './components/navBar/NavBar';

const App = () => {
  return (

      <Router>
        <div className="app">
          <NavBar/>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Usa PrivateRoute para proteger rutas */}
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/tasks" element={<PrivateRoute component={TaskList} />} />

            {/* Ruta por defecto */}
            <Route path="/" element={<Main />} />
          </Routes>
        </div>
      </Router>

  );
};

export default App;
