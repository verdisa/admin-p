import Navbar from '../components/Navbar';
import ClientesTable from './components/ClientesTable';
import Sidebar from '../components/Sidebar';
import '../pages/Comun.css'; // Importar estilos del layout principal
import './styles/ClientesPage.css';

export default function ClientesPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ClientesTable />
      </div>
    </div>
  );
}