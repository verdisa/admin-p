import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <h1>PAGINA INICIO</h1>
          <p>ESTA ES LA PAGINA DE INICIO DE MIDONKI ADMIN.</p>
        </div>
      </div>
      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
        }
        .home-content {
          display: flex;
        }
        .main-content {
          flex: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}