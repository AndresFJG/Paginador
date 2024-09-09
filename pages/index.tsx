import React, { useState } from 'react';
import EmployeeManagement from './components/EmployeeManagement';
import EmployeeFormModal from './components/EmployeeFormModal';
import { Employee } from '../types';
import { getCompleteEmployee } from './components/employeeUtils';
import axios from 'axios'; // Asegúrate de tener axios instalado

const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null); // Ahora es Partial<Employee>

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      if (employeeData.id) {
        // Si el empleado ya tiene un ID, lo actualizamos (PUT)
        await axios.put(`/api/${employeeData.id}`, employeeData);
      } else {
        // Si no tiene ID, creamos un nuevo empleado (POST)
        await axios.post('/api/employees', employeeData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error guardando el empleado:', error);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowModal(true); // Mostrar el modal con los datos del empleado seleccionado
  };

  return (
    <div>
      <EmployeeManagement onEditEmployee={handleEditEmployee} />
      {showModal && (
        <EmployeeFormModal
          employee={selectedEmployee ? getCompleteEmployee(selectedEmployee) : undefined}
          onSave={handleSaveEmployee} // onSave ahora acepta Partial<Employee>
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
