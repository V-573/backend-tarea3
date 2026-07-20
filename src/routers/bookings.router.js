import { Router } from 'express';
import { BookingManager } from '../managers/BookingManager.js';
import { ServiceManager } from '../managers/ServiceManager.js';

const bookingsRouter = Router();
const bookingManager = new BookingManager('./src/data/bookings.json');


// 2. INSTANCIAMOS el serviceManager aquí afuera
const serviceManager = new ServiceManager('./src/data/services.json');


// RUTA: Obtener todas las reservas (GET /api/bookings)
bookingsRouter.get('/', async (req, res) => {
  try {
    const bookings = await bookingManager.getBookings();
    res.status(200).json({ status: "success", data: bookings });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// RUTA: Obtener una reserva por ID (GET /api/bookings/:id)
bookingsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingManager.getBookingById(Number(id));
    
    if (!booking) {
      return res.status(404).json({ status: "error", message: "Reserva no encontrada" });
    }
    
    res.status(200).json({ status: "success", data: booking });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// RUTA: Crear una reserva (POST /api/bookings)
bookingsRouter.post('/', async (req, res) => {
  try {
    const { clientName, clientEmail, date, status, time, services } = req.body;

    if (!clientName || !services || !status) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios (clientName, services)" });
    }

    const newBooking = await bookingManager.createBooking({ clientName, clientEmail, date, status, time, services });
    res.status(201).json({ status: "success", data: newBooking });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


bookingsRouter.post('/:bid/services/:sid', async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const bookingId = parseInt(bid);
    const serviceId = parseInt(sid);

    // 1. Validar primero que el servicio realmente exista usando el ServiceManager
    await serviceManager.getServicesById(serviceId);

    // 2. Si existe, procedemos a agregarlo a la reserva
    const data = await bookingManager.addServiceToBooking(bookingId, serviceId);

    res.status(200).json({
      success: true,
      message: 'Servicio agregado a la reserva con éxito',
      data: data
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default bookingsRouter;