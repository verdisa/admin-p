import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../pages/Comun.css'; // Importar estilos del layout principal

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <div className="main-content">
          <h1>PAGINA INICIO</h1>
          <p>ESTA ES LA PAGINA DE INICIO DE MIDONKI ADMIN.</p>
        </div>
      </div>
      <style>{`
        .main-content {
          flex: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}