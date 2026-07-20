import express from 'express';
import servicesRouter from './routers/services.router.js';
import bookingsRouter from './routers/bookings.router.js';

const app= express();
app.use(express.json());

//Express necesita obligatoriamente que las rutas comiencen con una barra diagonal /. Al no ponerla, Express asume que la ruta literal es "api/services" sin raíz
app.use('/api/services', servicesRouter)
app.use('/api/bookings', bookingsRouter)

// Ruta de control por si alguien se pierde en la autopista (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `La ruta ${req.originalUrl} con el método ${req.method} no existe en este servidor.`
  });
});


export default app;