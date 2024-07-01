import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    allowExitOnIdle: true,
});

const verPosts = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        return rows;
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        throw { code: '500', message: 'Error al obtener los posts de la base de datos' };
    }
};

const agregarPost = async (post) => {
    const { titulo, img, descripcion } = post;

    if (!titulo?.trim() || !img?.trim() || !descripcion?.trim()) {
        throw { code: '400', message: 'Todos los campos son obligatorios' };
    }

    const consulta = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [titulo, img, descripcion, 0];

    try {
        const { rows } = await pool.query(consulta, values);
        return rows[0];
    } catch (error) {
        console.error('Error al agregar el post:', error);
        if (error.code === '23505') { // Ejemplo de manejo de error específico de PostgreSQL (violación de llave única)
            throw { code: '409', message: 'Post ya existe' };
        }
        throw { code: '500', message: 'Error al agregar el post a la base de datos' };
    }
};

export { verPosts, agregarPost };
