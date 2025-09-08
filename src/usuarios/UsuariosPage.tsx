import Navbar from '../components/Navbar';
import UserTable from './components/UserTable';
import Sidebar from '../components/Sidebar';
import './styles/Usuarios.css'; // Asegúrate de importar el archivo CSS

export default function Usuarios() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <UserTable />
      </div>
    </div>
  );
}