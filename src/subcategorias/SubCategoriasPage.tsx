import Navbar from '../components/Navbar';
import SubCategoriesTable from './components/SubCategoriesTable';
import Sidebar from '../components/Sidebar';
import '../pages/Comun.css'; // Asegúrate de importar el archivo CSS

export default function SubCategorias() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <SubCategoriesTable />
      </div>
    </div>
  );
}