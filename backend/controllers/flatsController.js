const flatsModel = require("../models/flatsModel");

const getFlats = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "flats.id";

    const filterSort = ["flats.id", "flat_number", "flat_type"].includes(sort) ? sort : "flats.id";

    const flats = await flatsModel.getFlats({ search, page, limit, sort: filterSort });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFlat = async (req, res) => {
  try {
    const newFlat = await flatsModel.createFlat(req.body);
    res.status(201).json(newFlat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFlat = await flatsModel.updateFlat(id, req.body);
    if (!updatedFlat) return res.status(404).json({ error: "Flat not found" });
    res.json(updatedFlat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFlat = await flatsModel.deleteFlat(id);
    if (!deletedFlat) return res.status(404).json({ error: "Flat not found" });
    res.json({ message: "Flat disabled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat
};