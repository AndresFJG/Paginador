import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Employee } from '@/types/index';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import EmployeeFormModal from './EmployeeFormModal';
import { getCompleteEmployee } from './employeeUtils';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface EmployeeManagementProps {
  onEditEmployee: (employee: Employee) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onEditEmployee }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({ tipo: '', centroTrabajo: '', registro: '', estado: '', cargo: '', search: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);
  const [selectedNovedades, setSelectedNovedades] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('/api/employees', {
        params: { page, limit, ...filters },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdateEmployee = async (id: number, updatedData: Partial<Employee>) => {
    try {
      const response = await axios.put(`/api/employees/${id}`, updatedData);
      console.log('Empleado actualizado:', response.data);
      fetchEmployees();
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      const response = await axios.delete(`/api/employees/${id}`);
      console.log('Empleado eliminado:', response.data);
      fetchEmployees();
    } catch (error: any) {
      console.error('Error al eliminar empleado:', error.response?.data || error.message);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      if (employeeData.id) {
        await axios.put(`/api/employees/${employeeData.id}`, employeeData);
      } else {
        await axios.post('/api/employees', employeeData);
      }
      fetchEmployees();
      setShowModal(false);
    } catch (error) {
      console.error('Error guardando el empleado:', error);
    }
  };

  const handleShowNovedades = (novedades: string) => {
    setSelectedNovedades(novedades);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
    XLSX.writeFile(workbook, 'empleados.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Nombre', 'Tipo de Identificación', 'Documento', 'Centro de Trabajo', 'Registro', 'Estado', 'Fecha de Ingreso', 'Retiro', 'Cargo', 'Novedades', 'Creación', 'Gestión']],
      body: employees.map((employee) => [
        employee.id,
        employee.nombre,
        employee.tipo_documento,
        employee.documento,
        employee.centro_trabajo,
        employee.registro,
        employee.estado,
        employee.fecha_ingreso,
        employee.fecha_retiro,
        employee.cargo,
        employee.novedades,
        employee.fecha_creacion,
        'Gestión'
      ]),
    });
    doc.save('empleados.pdf');
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <div>
      <div className="button-group">
      <h1>Gestor de empleados</h1>
        <input
          type="text"
          name="search"
          placeholder="Buscar empleados..."
          value={filters.search || ''}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <button className="btn" onClick={handleAddEmployee}>Nuevo Trabajador</button>
        <button className="btn" onClick={handleExportExcel}>Exportar a Excel</button>
        <button className="btn" onClick={handleExportPDF}>Exportar a PDF</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>
              <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                <option value="">Tipo de Identificación</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </th>
            <th>Documento</th>
            <th>
              <select name="centroTrabajo" value={filters.centroTrabajo} onChange={handleFilterChange}>
                <option value="">Centro de Trabajo</option>
                <option value="Oficina">Oficina</option>
                <option value="Fábrica">Fábrica</option>
                <option value="Remoto">Remoto</option>
              </select>
            </th>
            <th>
              <select name="registro" value={filters.registro} onChange={handleFilterChange}>
                <option value="">Registro</option>
                <option value="registrado">Registrado</option>
                <option value="no_registrado">No registrado</option>
              </select>
            </th>
            <th>
              <select name="estado" value={filters.estado} onChange={handleFilterChange}>
                <option value="">Estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </th>
            <th>Fecha de Ingreso</th>
            <th>Fecha de Retiro</th>
            <th>
              <select name="cargo" value={filters.cargo} onChange={handleFilterChange}>
                <option value="">Cargo</option>
                <option value="Gerente">Gerente</option>
                <option value="Operario">Operario</option>
                <option value="Asistente">Asistente</option>
              </select>
            </th>
            <th>Novedades</th>
            <th>Creación</th>
            <th>Gestión</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.nombre}</td>
              <td>{employee.tipo_documento}</td>
              <td>{employee.documento}</td>
              <td>{employee.centro_trabajo}</td>
              <td>{employee.registro ? 'Registrado' : 'No registrado'}</td>
              <td>
                <button onClick={() => handleUpdateEmployee(employee.id, { estado: employee.estado === 'Activo' ? 'Inactivo' : 'Activo' })}>
                  {employee.estado}
                </button>
              </td>
              <td>{employee.fecha_ingreso}</td>
              <td>{employee.fecha_retiro}</td>
              <td>{employee.cargo}</td>
              <td>
                <button onClick={() => handleShowNovedades(employee.novedades || 'No hay novedades')}>Ver Novedades</button>
              </td>
              <td>{employee.fecha_creacion}</td>
              <td>
                <button onClick={() => onEditEmployee(employee)}>Gestionar</button>
                <button onClick={() => handleDeleteEmployee(employee.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='Footer' style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
        <button onClick={() => setPage(page + 1)} disabled={employees.length < limit}>Siguiente</button>
            {/* Selector para el límite de empleados por página */}
            <label htmlFor="limit-select">Empleados por página:</label>
        <select id="limit-select" value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {showModal && (
        <EmployeeFormModal
          employee={selectedEmployee ? getCompleteEmployee(selectedEmployee) : undefined}
          onSave={handleSaveEmployee}
          onClose={() => setShowModal(false)}
        />
      )}

      {selectedNovedades && (
        <div className="modal">
          <div className="modal-content">
            <h2>Novedades</h2>
            <p>{selectedNovedades}</p>
            <button onClick={() => setSelectedNovedades(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
