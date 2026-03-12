const express = require("express");
const router = express.Router();

const flatsController = require("../controllers/flatsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Require authentication for reading flats
router.use(authMiddleware);
router.get("/",flatsController.getFlats);

// Require ADMIN role for modifying flats
router.use(roleMiddleware("ADMIN"));
router.post("/",flatsController.createFlat);
router.put("/:id",flatsController.updateFlat);
router.delete("/:id",flatsController.deleteFlat);

module.exports = router;