import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleError } from './database/error.js';
import { agregarPost, verPosts } from './database/consultas.js';
import Joi from 'joi';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ON http://localhost:${PORT}`);
});

// Esquema de validación para los posts
const postSchema = Joi.object({
    titulo: Joi.string().required(),
    img: Joi.string().uri().required(),
    descripcion: Joi.string().required()
});

app.get('/posts', async (req, res, next) => {
    try {
        const result = await verPosts();
        res.status(200).json({ ok: true, message: 'Registro de Posts', result });
    } catch (error) {
        next(error);
    }
});

app.post('/posts', async (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ ok: false, result: error.details[0].message });

    const post = {
        titulo: req.body.titulo,
        img: req.body.img,
        descripcion: req.body.descripcion
    };

    try {
        const result = await agregarPost(post);
        res.status(201).json({ ok: true, message: 'Post agregado optimamente', result });
    } catch (error) {
        next(error);
    }
});

app.use('*', (req, res) => {
    res.status(404).json({ ok: false, result: '404 Pagina sin acceso' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    const { status, message } = handleError(err.code) || { status: 500, message: 'Error interno del servidor' };
    res.status(status).json({ ok: false, result: message });
});
