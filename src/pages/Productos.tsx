import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductosTable from '../data-tables/ProductosTable';
import './Comun.css'; // Asegúrate de importar el archivo CSS


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

