import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProveedoresTable from './components/ProveedoresTable';
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

