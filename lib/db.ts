import { Pool } from 'pg';

// Configuración del pool de conexiones a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_empleados',
  password: 'root',
  port: 5432,
});

export default pool;
