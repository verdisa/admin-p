import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PosTable from '../data-tables/PosTable';

const PosPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="pos-container">
        <Sidebar />
        <div className="content">
          <h1>Gestión de POS</h1>
          <PosTable />
        </div>
      </div>
    </div>
  );
};

export default PosPage;
