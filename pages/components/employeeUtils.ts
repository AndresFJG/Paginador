import { Employee } from '@/types/index';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extensión para jsPDF para incluir autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

// Función para completar los datos de un empleado parcial
export const getCompleteEmployee = (employee: Partial<Employee> | null): Employee => {
    return {
        id: employee?.id ?? 0,
        nombre: employee?.nombre ?? '',
        documento: employee?.documento ?? '',
        tipo_documento: employee?.tipo_documento ?? '',
        centro_trabajo: employee?.centro_trabajo ?? '',
        tipo_empleado: employee?.tipo_empleado ?? '',
        registro: employee?.registro ?? false,
        estado: employee?.estado ?? '',
        fecha_ingreso: employee?.fecha_ingreso ?? '',
        fecha_retiro:employee?.fecha_retiro ?? '',
        cargo: employee?.cargo ?? '',
        novedades: employee?.novedades ?? '',
        fecha_creacion:employee?.fecha_creacion ?? ''
    };
};

// Función para obtener la lista de empleados
export const fetchEmployees = async (filters: any, page: number, limit: number): Promise<Employee[]> => {
    try {
        const response = await axios.get('/api/employees', {
            params: { page, limit, ...filters },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

// Función para actualizar un empleado
export const handleUpdateEmployee = async (id: number, updatedData: Partial<Employee>) => {
    try {
        await axios.put(`/api/employees/${id}`, updatedData);
    } catch (error) {
        console.error('Error updating employee:', error);
    }
};

// Función para exportar empleados a Excel
export const handleExportExcel = (employees: Employee[]) => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
    XLSX.writeFile(workbook, 'empleados.xlsx');
};

// Función para exportar empleados a PDF
export const handleExportPDF = (employees: Employee[], columns: string[]) => {
    const doc = new jsPDF();
    doc.autoTable({
        head: [columns.map(col => col.charAt(0).toUpperCase() + col.slice(1))], 
        body: employees.map((employee) => columns.map((col) => employee[col as keyof Employee] || '')),
    });
    doc.save('empleados.pdf');
};
