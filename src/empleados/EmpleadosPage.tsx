import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmpleadosTable from './components/EmpleadosTable';
import './styles/EmpleadosPage.css';

export default function EmpleadosPage() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <EmpleadosTable />
      </div>
    </div>
  );
}
