const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'retomatematico';
let db;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Backend: Conectado exitosamente a la base de datos MongoDB.');
        db = client.db(dbName);
    } catch (error) {
        console.error('Backend Error: No se pudo conectar a la base de datos.', error);
        process.exit(1);
    }
};

app.get('/api/puntuaciones', async (req, res) => {
    try {
        const collection = db.collection('puntuaciones');
        const topScores = await collection.find({}).sort({ puntaje: -1 }).limit(10).toArray();
        res.status(200).json(topScores);
    } catch (error) {
        console.error('Error al obtener puntuaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/puntuaciones', async (req, res) => {
    const { nombre, puntaje } = req.body;
    if (!nombre || typeof puntaje !== 'number') {
        return res.status(400).json({ error: 'Nombre y puntaje son requeridos.' });
    }
    try {
        const collection = db.collection('puntuaciones');
        const newScore = { nombre: nombre, puntaje: puntaje, fecha_creacion: new Date() };
        await collection.insertOne(newScore);
        res.status(201).json({ message: 'Puntuación guardada exitosamente' });
    } catch (error) {
        console.error('Error al guardar la puntuación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Backend: Servidor escuchando en http://localhost:${port}`);
    });
});