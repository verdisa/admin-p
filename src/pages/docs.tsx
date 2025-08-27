import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Docs = () => {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <div className="documentation-content">
          <h1>Documentación del Proyecto</h1>
          <section>
            <h2>Introducción</h2>
            <p>Este proyecto es una aplicación de gestión que incluye funcionalidades para manejar usuarios, operadores, categorías y subcategorías.</p>
          </section>
          <section>
            <h2>Componentes Principales</h2>
            <ul>
              <li><strong>Navbar:</strong> Barra de navegación principal.</li>
              <li><strong>Sidebar:</strong> Barra lateral con el menú de navegación.</li>
              <li><strong>TableReadData:</strong> Componente para mostrar y editar datos en una tabla.</li>
              <li><strong>AddModal:</strong> Modal para agregar nuevos registros.</li>
            </ul>
          </section>
          <section>
            <h2>Páginas</h2>
            <ul>
              <li><strong>Usuarios:</strong> Página para gestionar usuarios.</li>
              <li><strong>Operadores:</strong> Página para gestionar operadores.</li>
              <li><strong>Categorías:</strong> Página para gestionar categorías.</li>
              <li><strong>SubCategorías:</strong> Página para gestionar subcategorías.</li>
            </ul>
          </section>
          <section>
            <h2>Estilos</h2>
            <p>El proyecto utiliza Tailwind CSS para los estilos y algunos estilos personalizados en archivos CSS.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Docs;
