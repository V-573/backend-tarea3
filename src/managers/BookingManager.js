import fs from 'fs/promises';

export class BookingManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
     
      return [];
    }
  }

    async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
  }

// async getBookings(){
//       const bookings = await this._readFile();
//     return bookings
// }

  async getBookingById(id) {
    const bookings = await this._readFile();
    const booking = bookings.find(b => b.id === Number(id));
  
    if (!booking) {
      throw new Error(`La reserva con ID ${Number(id)} no existe.`);
    }
    return booking;
  }


  async createBooking(bookingData) {
    const { clientName, clientEmail, date, time, status, services} = bookingData;


    if (clientName=== undefined || clientEmail === undefined || date === undefined || 
        time === undefined || status === undefined ) {
      throw new Error("❌ Error: Todos los campos son obligatorios (clientName, clientEmail, date, time, status).");
    }

    const bookings = await this._readFile();
    
    // Generación de ID auto-incremental elemental
    const nextId = bookings.length > 0 ? Math.max(...bookings.map(s => s.id)) + 1 : 1;
   
    const newBooking = {
      id: nextId,
      clientName,
      clientEmail,
       date,
       status,
      time,
      services: services || []
    };

    bookings.push(newBooking);
    await this._writeFile( bookings );
    return newBooking;
  }



  // Agregar un servicio a una reserva existente
  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this._readFile();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
      throw new Error(`La reserva con ID ${bookingId} no existe.`);
    }

    const booking = bookings[bookingIndex];

    const serviceIndex = booking.services.findIndex(s => s.service === serviceId);

    if (serviceIndex !== -1) {
     
      booking.services[serviceIndex].quantity += 1;
    } else {
     
      booking.services.push({
        service: serviceId,
        quantity: 1
      });
    }

    bookings[bookingIndex] = booking;
    await this._writeFile(bookings);

    return booking;
  }
}