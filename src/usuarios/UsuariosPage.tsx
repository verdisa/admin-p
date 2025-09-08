import Navbar from '../components/Navbar';
import UserTable from './components/UserTable';
import Sidebar from '../components/Sidebar';
import '../pages/Comun.css'; // Importar estilos del layout principal
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