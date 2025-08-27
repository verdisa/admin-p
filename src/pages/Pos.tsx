import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PosTable from '../data-tables/PosTable';



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

