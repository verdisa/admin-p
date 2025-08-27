import Navbar from '../components/Navbar';
import CategoriesTable from '../data-tables/CategoriesTable';
import Sidebar from '../components/Sidebar';
import './Comun.css'; // Asegúrate de importar el archivo CSS

export default function Categorias() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <CategoriesTable />
      </div>
    </div>
  );
}