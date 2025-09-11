import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmpleadosTable from './components/EmpleadosTable';
import '../pages/Comun.css'; // Importar estilos del layout principal
import './styles/EmpleadosPage.css';

export default function EmpleadosPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <EmpleadosTable />
      </div>
    </div>
  );
}
