import fs from "fs/promises";

export class ServiceManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async _writeFile(newData) {
    await fs.writeFile(this.path, JSON.stringify(newData, null, 2), "utf-8");
  }

  // async getServices(){
  //     return await this._readFile();
  // }

  async getServicesById(id) {
    const services = await this._readFile();
    const service = services.find((s) => s.id === id);

    if (!service) {
      throw new Error(`El servicio con ID ${id} no existe.`);
    }
    return service;
  }

  async getServicesByName(name) {
    const services = await this._readFile();

    const queryName = name.toLowerCase();

    const filteredServices = services.filter((s) =>
      s.name.toLowerCase().includes(queryName),
    );

    if (filteredServices.length === 0) {
      throw new Error(`No se encontraron servicios que coincidan con: ${name}`);
    }

    return filteredServices;
  }

  async getServicesByCategory(category) {
    const services = await this._readFile();

    const queryCategory = category.toLowerCase();
    console.log("lo que agarra de queryCategory", queryCategory);

    const filteredServices = services.filter((s) =>
      s.category.toLowerCase().includes(queryCategory),
    );

    if (filteredServices.length === 0) {
      throw new Error(
        `No se encontraron servicios que coincidan con la categoria: ${category}`,
      );
    }

    return filteredServices;
  }

  async getServicesByAvailable(availableStatus) {
    const services = await this._readFile();

    // Filtramos todos los servicios available
    const filteredAvailable = services.filter(
      (s) => s.available === availableStatus,
    );

    if (filteredAvailable.length === 0) {
      throw new Error(`No se encontraron servicios disponibles`);
    }

    return filteredAvailable;
  }

  async addService(data) {
    const { name, description, duration, price, category, available } = data;
    // Validación estricta de campos obligatorios
    if (
      name === undefined ||
      description === undefined ||
      duration === undefined ||
      price === undefined ||
      category === undefined ||
      available === undefined
    ) {
      throw new Error(
        "❌ Error: Todos los campos son obligatorios (name, description, duration, price, category, available).",
      );
    }

    const services = await this._readFile();

    const newService = {
      id: Date.now(),
      name,
      description,
      duration,
      price,
      category,
      available,
    };

    services.push(newService);
    await this._writeFile(services);
    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this._readFile();
    const index = services.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(
        `No se puede actualizar. El servicio con ID ${id} no existe.`,
      );
    }

    // Conservamos el ID original y reemplazamos/mezclamos las propiedades actualizadas
    services[index] = { ...services[index], ...updatedData, id };

    await this._writeFile(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this._readFile();
    const index = services.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(
        `No se puede eliminar. El servicio con ID ${id} no existe.`,
      );
    }

    const deletedService = services.splice(index, 1)[0];
    await this._writeFile(services);
    return deletedService;
  }
}
