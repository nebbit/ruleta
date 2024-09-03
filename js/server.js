const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Cambia esto si tienes un usuario diferente
  password: '',  // Cambia esto si tienes una contraseña
  database: 'ruleta_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

app.use(express.json());

// Ruta para generar un enlace único
app.post('/generate-link', (req, res) => {
  const { email } = req.body;

  // Generar un código único
  const uniqueCode = crypto.randomBytes(16).toString('hex');

  // Insertar el usuario en la base de datos
  const query = 'INSERT INTO users (email, uniqueCode) VALUES (?, ?)';
  connection.query(query, [email, uniqueCode], (err, results) => {
    if (err) throw err;

    // Generar el enlace único
    const uniqueLink = `http://localhost:${PORT}/juego?codigo=${uniqueCode}`;

    // Enviar el enlace al usuario (opcionalmente usando sendEmail)
    console.log(`Enviar este enlace al usuario: ${uniqueLink}`);

    res.status(200).json({ message: 'Enlace generado', link: uniqueLink });
  });
});

// Ruta para verificar el código y permitir el acceso al juego
app.get('/juego', (req, res) => {
  const { codigo } = req.query;

  // Verificar si el código es válido y no ha sido utilizado
  const query = 'SELECT * FROM users WHERE uniqueCode = ?';
  connection.query(query, [codigo], (err, results) => {
    if (err) throw err;

    if (results.length > 0 && !results[0].hasPlayed) {
      // Actualizar el estado a 'hasPlayed'
      const updateQuery = 'UPDATE users SET hasPlayed = TRUE WHERE uniqueCode = ?';
      connection.query(updateQuery, [codigo], (err, updateResults) => {
        if (err) throw err;

        // Responder con acceso permitido
        res.status(200).send('¡Acceso al juego permitido!');
      });
    } else {
      res.status(400).send('Enlace no válido o ya utilizado.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
