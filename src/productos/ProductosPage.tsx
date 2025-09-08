import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductosTable from './components/ProductosTable';
import '../pages/Comun.css'; // Importar estilos del layout principal
import './styles/ProductosPage.css'; // Asegúrate de importar el archivo CSS

export default function ProductosPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ProductosTable />
      </div>
    </div>
  );
}

