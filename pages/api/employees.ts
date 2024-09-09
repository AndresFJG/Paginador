import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from '@/lib/db'; // Asegúrate de que esta ruta sea correcta

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Método ${method} no permitido`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 10, tipo, centroTrabajo, registro, estado, cargo, search } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = 'SELECT * FROM empleados WHERE 1=1';
    const queryParams: (string | number)[] = [];

    if (search) {
      queryParams.push(`%${search}%`);
      query += ` AND (nombre ILIKE $${queryParams.length} OR documento ILIKE $${queryParams.length})`;
    }

    // Filtro por tipo de documento
    if (tipo) {
      queryParams.push(tipo as string);
      query += ` AND tipo_documento = $${queryParams.length}`;
    }

    // Filtro por centro de trabajo
    if (centroTrabajo) {
      queryParams.push(centroTrabajo as string);
      query += ` AND centro_trabajo = $${queryParams.length}`;
    }

    // Filtro por registro
    if (registro !== undefined && registro !== '') {
      // Convertir 'registrado' y 'no_registrado' a booleanos
      const registroBool = registro === 'registrado' ? true : false;
      queryParams.push(registroBool ? 1 : 0);  // Convertir booleano a número
      query += ` AND registro = $${queryParams.length}`;
    }

    // Filtro por estado
    if (estado) {
      queryParams.push(estado as string);
      query += ` AND estado = $${queryParams.length}`;
    }

    // Filtro por cargo
    if (cargo) {
      queryParams.push(cargo as string);
      query += ` AND cargo = $${queryParams.length}`;
    }

    // Orden y paginación
    query += ` ORDER BY id LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit as string), offset);

    const result = await dotenv.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
}


async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nombre, documento, tipo_documento, centro_trabajo, tipo_empleado, estado, fecha_ingreso, cargo, novedades } = req.body;

    if (!fecha_ingreso) {
      return res.status(400).json({ error: 'La fecha de ingreso es obligatoria.' });
    }

    const query = `
      INSERT INTO empleados (nombre, documento, tipo_documento, centro_trabajo, tipo_empleado, estado, fecha_ingreso, cargo, novedades)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;
    const values = [nombre, documento, tipo_documento, centro_trabajo, tipo_empleado, estado, fecha_ingreso, cargo, novedades];

    const result = await dotenv.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(err, res);
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { nombre, documento, tipo_documento, centro_trabajo, tipo_empleado, estado, fecha_ingreso, cargo, novedades } = req.body;

    const query = `
      UPDATE empleados
      SET nombre = $1, documento = $2, tipo_documento = $3, centro_trabajo = $4, tipo_empleado = $5, estado = $6, fecha_ingreso = $7, cargo = $8, novedades = $9
      WHERE id = $10 RETURNING *
    `;
    const values = [nombre, documento, tipo_documento, centro_trabajo, tipo_empleado, estado, fecha_ingreso, cargo, novedades, Number(id)];

    const result = await dotenv.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Empleado no encontrado');
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: NextApiResponse) {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  } else {
    console.error('Unexpected error', err);
    res.status(500).send('Error inesperado');
  }
}
