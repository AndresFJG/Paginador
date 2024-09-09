export interface Employee {
  id: number;                        // Identificador único
  nombre: string;                    // Nombre completo del empleado
  tipo_documento: string;            // Tipo de documento (Cédula, Pasaporte, Tarjeta de Identidad)
  documento: string;                 // Número del documento
  centro_trabajo: string;            // Centro de trabajo
  tipo_empleado: string;
  registro: boolean;                 // Si está registrado o no (true/false)
  estado: string;                    // Estado del empleado (activo/inactivo)
  fecha_ingreso: string | null;      // Fecha de ingreso a la empresa (puede ser null)
  fecha_retiro?: string | null;      // Fecha de retiro de la empresa (puede ser null si aún no ha sido retirado)
  cargo: string;                     // Cargo que ocupa el empleado
  novedades: string;                 // Novedades asociadas al empleado
  fecha_creacion: string;            // Fecha de creación en la base de datos (timestamp)
}
