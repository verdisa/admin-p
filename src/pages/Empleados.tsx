import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import OperatorTable from '../data-tables/EmpleadosTable'

export default function Operadores() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <OperatorTable />
      </div>
    </div>

  )
}
