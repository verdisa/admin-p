import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import PosTable from './PosTable';
import '../../pages/Comun.css'; // Importar estilos del layout principal



export default function PosPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <PosTable />
      </div>
    </div>
  );
}

