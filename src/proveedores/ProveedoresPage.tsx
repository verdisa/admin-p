import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProveedoresTable from './components/ProveedoresTable';
import '../pages/Comun.css'; // Importar estilos del layout principal
import './styles/ProveedoresPage.css';

export default function ProveedoresPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ProveedoresTable />
      </div>
    </div>
  );
}

