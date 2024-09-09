import React, { useState } from 'react';
import { Employee } from '@/types/index';

interface EmployeeFormModalProps {
  employee?: Employee; // Campo opcional para edición o creación
  onSave: (employeeData: Partial<Employee>) => Promise<void>;
  onClose: () => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employee, onSave, onClose }) => {
  // Inicializamos el formulario con los valores del empleado o con valores por defecto
  const [formData, setFormData] = useState<Partial<Employee>>({
    id: employee?.id || undefined,  // Incluye el ID si existe
    nombre: employee?.nombre || '',
    documento: employee?.documento || '',
    tipo_documento: employee?.tipo_documento || '',
    centro_trabajo: employee?.centro_trabajo || '',
    registro: employee?.registro ?? false, 
    estado: employee?.estado || '',
    fecha_ingreso: employee?.fecha_ingreso || '', 
    cargo: employee?.cargo || '',
    novedades: employee?.novedades || '',
  });

  // Manejador de cambios en los inputs, selects y textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      // Si el campo es de tipo checkbox, usamos la propiedad checked
      setFormData({
        ...formData,
        [name]: e.target.checked, // Convertimos el checkbox a booleano
      });
    } else {
      // Para otros tipos de inputs (text, select, textarea, etc.)
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Llama a la función onSave y pasa el formData, que incluye el ID si está editando
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{employee ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre || ''} 
              onChange={handleChange} 
              required 
            />
          </label>

          <label>
            Documento:
            <input 
              type="text" 
              name="documento" 
              value={formData.documento || ''} 
              onChange={handleChange} 
              required 
            />
          </label>

          {/* Botón desplegable para Tipo de Documento */}
          <label>
            Tipo de Documento:
            <select 
              name="tipo_documento" 
              value={formData.tipo_documento || ''} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona tipo de documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </label>

          {/* Botón desplegable para Centro de Trabajo */}
          <label>
            Centro de Trabajo:
            <select 
              name="centro_trabajo" 
              value={formData.centro_trabajo || ''} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona centro de trabajo</option>
              <option value="Oficina">Oficina</option>
              <option value="Fábrica">Fábrica</option>
              <option value="Remoto">Remoto</option>
            </select>
          </label>

          {/* Campo para Registro */}
            <label>
              Registro:
              <select 
                name="registro" 
                value={formData.registro === undefined ? "" : (formData.registro ? 'registrado' : 'no_registrado')} 
                onChange={(e) => setFormData({ ...formData, registro: e.target.value === 'registrado' ? true : e.target.value === 'no_registrado' ? false : undefined })}
              >
                <option value="">Seleccione una opción</option>  {/* Opción por defecto */}
                <option value="registrado">Registrado</option>
                <option value="no_registrado">No Registrado</option>
              </select>
            </label>

          {/* Botón desplegable para Estado */}
          <label>
            Estado:
            <select 
              name="estado" 
              value={formData.estado || ''} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>

          <label>
            Fecha de Ingreso:
            <input 
              type="date" 
              name="fecha_ingreso" 
              value={formData.fecha_ingreso || ''} 
              onChange={handleChange} 
              required 
            />
          </label>

          {/* Botón desplegable para Cargo */}
          <label>
            Cargo:
            <select 
              name="cargo" 
              value={formData.cargo || ''} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona cargo</option>
              <option value="Gerente">Gerente</option>
              <option value="Operario">Operario</option>
              <option value="Asistente">Asistente</option>
            </select>
          </label>

          <label>
            Novedades:
            <textarea 
              name="novedades" 
              value={formData.novedades || ''} 
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
