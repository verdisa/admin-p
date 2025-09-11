import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import PosTable from './PosTable';
import '../styles/PosPage.css'; // Importar estilos específicos del POS

export default function PosPage() {
  return (
    <div className="pos-page-container">
      <Navbar />
      <div className="pos-layout">
        <Sidebar />
        <div className="pos-content">
          <PosTable />
        </div>
      </div>
    </div>
  );
}

