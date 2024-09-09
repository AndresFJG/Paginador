// import { NextApiRequest, NextApiResponse } from 'next';
// import pool from '@/lib/db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   const { id } = req.query;

//   if (!id || isNaN(Number(id))) {
//     return res.status(400).json({ error: 'ID inválido' });
//   }

//   switch (method) {
//     case 'GET':
//       return getEmployee(req, res, Number(id));
//     case 'PUT':
//       return updateEmployee(req, res, Number(id));
//     case 'DELETE':
//       return deleteEmployee(req, res, Number(id));
//     default:
//       res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
//       return res.status(405).end(`Método ${method} no permitido`);
//   }
// }

// const getEmployee = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
//   try {
//     const result = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Empleado no encontrado' });
//     }
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener empleado' });
//   }
// };

// const updateEmployee = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
//   try {
//     const { nombre, tipo_documento, documento, centro_trabajo, estado, cargo } = req.body;
//     const result = await pool.query(
//       `UPDATE empleados SET nombre = $1, tipo_documento = $2, documento = $3, centro_trabajo = $4, estado = $5, cargo = $6 WHERE id = $7 RETURNING *`,
//       [nombre, tipo_documento, documento, centro_trabajo, estado, cargo, id]
//     );
//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Empleado no encontrado' });
//     }
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al actualizar empleado' });
//   }
// };

// const deleteEmployee = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
//   try {
//     const result = await pool.query('DELETE FROM empleados WHERE id = $1 RETURNING *', [id]);
//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Empleado no encontrado' });
//     }
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar empleado' });
//   }
// };

import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // Ajusta la ruta según tu estructura

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query; // Obtén el ID del query param

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  switch (method) {
    case 'DELETE':
      return handleDeleteEmployee(req, res, Number(id));
    case 'PUT':
      return handleUpdateEmployee(req, res, Number(id));
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}

async function handleUpdateEmployee(req: NextApiRequest, res: NextApiResponse, id: number) {
  try {
    const { nombre, documento, tipo_documento, centro_trabajo, registro, estado, fecha_ingreso, cargo, novedades } = req.body;

    // Actualización del empleado
    const query = `
      UPDATE empleados
      SET nombre = $1, documento = $2, tipo_documento = $3, centro_trabajo = $4, registro = $5, estado = $6, fecha_ingreso = $7, cargo = $8, novedades = $9
      WHERE id = $10 RETURNING *
    `;
    const values = [nombre, documento, tipo_documento, centro_trabajo, registro, estado, fecha_ingreso, cargo, novedades, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

async function handleDeleteEmployee(_req: NextApiRequest, res: NextApiResponse, id: number) {
  try {
    const query = 'DELETE FROM empleados WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    return res.status(200).json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
