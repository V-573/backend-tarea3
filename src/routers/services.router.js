import { Router } from 'express';
import { ServiceManager } from '../managers/ServiceManager.js';

const servicesRouter = Router();

// Instanciamos el mánager pasándole la ruta de su archivo JSON
const serviceManager = new ServiceManager('./src/data/services.json');

// RUTA: Obtener todos los servicios (GET /api/services)
servicesRouter.get('/', async (req, res) => {
 try {
    const { name, available, category } = req.query;

    if (name) {
      const cleanName = name.replace(/['"]+/g, ''); 
      const data = await serviceManager.getServicesByName(cleanName);
      return res.status(200).json({ success: true, data });
    }
    
    if (available !== undefined) {
      const availableBool = available === 'true';
      const data = await serviceManager.getServicesByAvailable(availableBool);
      return res.status(200).json({ success: true, data });
    } 

    if (category) {
      const cleanCategory = category.replace(/['"]+/g, ''); 
      const data = await serviceManager.getServicesByCategory(cleanCategory);
      return res.status(200).json({
        success: true,
        message: "Resultados de las categorías encontradas", 
        data
      });
    }

    const data = await serviceManager.getServices();
    return res.status(200).json({ success: true, message: "Todos los servicios", data });

  } catch (error) {
    console.error("Error en getServices:", error.message);
    return res.status(404).json({
      success: false, 
      message: error.message || "Error al obtener datos"
    });
  }
});







// RUTA: Obtener un servicio por ID (GET /api/services/:id)
servicesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Capturamos el parámetro de la URL
    const service = await serviceManager.getServicesById(Number(id));
    
    if (!service) {
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }
    
    res.status(200).json({ status: "success", data: service });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// RUTA: Crear un servicio (POST /api/services)
servicesRouter.post('/', async (req, res) => {
  try {
    const { name, description, duration, price, category, available } = req.body;

    // Validación básica en la entrada de la carretera
    if (!name || !price) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios (name, price)" });
    }

    const newService = await serviceManager.addService({ name, description, duration, price, category, available });
    res.status(201).json({ status: "success", data: newService });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

servicesRouter.put('/:id', async (req, res)=>{

 try {
    const { id } = req.params;
    const data = await serviceManager.updateService(parseInt(id), req.body);
    return res.status(200).json({
      success: true,
      message: 'Dato actualizado con éxito',
      data
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Error al actualizar" });
  }

});

servicesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await serviceManager.deleteService(parseInt(id));
    return res.status(200).json({ success: true, message: "Dato eliminado con éxito", data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "El dato no pudo ser eliminado" });
  }
});



export default servicesRouter;