import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();
const serviceManager = new ServiceManager();
const REQUIRED_FIELDS = ["name", "description", "duration", "price", "category", "available"];

router.get("/", (req, res) => {
  return res.status(200).json(serviceManager.getServices());
});

router.get("/:id", (req, res) => {
  const service = serviceManager.getServicesById(req.params.id);

  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  return res.status(200).json(service);
});

router.post("/", (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "El body debe ser un objeto JSON" });
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Body inválido. Faltan campos requeridos: ${missingFields.join(", ")}`,
    });
  }

  const created = serviceManager.createService(
    body.name,
    body.description,
    body.duration,
    body.price,
    body.category,
    body.available
  );

  if (!created) {
    return res.status(400).json({
      error: "No se pudo crear el servicio. Todos los campos son requeridos.",
    });
  }

  return res.status(201).json(created);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "El body debe ser un objeto JSON" });
  }

  if (body.id && body.id !== id) {
    return res.status(400).json({ error: "No se permite modificar el id del servicio" });
  }

  const { id: _ignoredId, ...data } = body;
  const allowedFields = ["name", "description", "duration", "price", "category", "available"];
  const hasValidField = allowedFields.some((field) => data[field] !== undefined);

  if (!hasValidField) {
    return res.status(400).json({
      error: "Body inválido. Enviá al menos un campo para actualizar: name, description, duration, price, category, available",
    });
  }

  const updated = serviceManager.updateService(id, data);

  if (!updated) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  return res.status(200).json(updated);
});

router.delete("/:id", (req, res) => {
  const deleted = serviceManager.deleteService(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  return res.status(200).json(deleted);
});

export default router;
