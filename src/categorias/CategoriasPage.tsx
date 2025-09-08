import Navbar from '../components/Navbar';
import CategoriesTable from './components/CategoriesTable';
import Sidebar from '../components/Sidebar';
import './styles/CategoriasPage.css';

export default function CategoriasPage() {
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