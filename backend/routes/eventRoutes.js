import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// PATCH update available tickets
router.patch('/:id/tickets', async (req, res) => {
  try {
    const { availableTickets } = req.body;
    if (typeof availableTickets !== 'number') {
      return res.status(400).json({ message: 'availableTickets must be a number' });
    }
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { availableTickets, updatedAt: new Date().toISOString() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(400).json({ message: 'Error updating tickets' });
  }
});


// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// POST create event
// router.post("/", async (req, res) => {
//   try {
//     const event = new Event(req.body);
//     await event.save();
//     res.json(event.toJSON());
//   } catch (err) {
//     res.status(400).json({ message: "Error creating event" });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Event creation error:", error.message);
    res.status(400).json({ message: "Error creating event", error: error.message });
  }
});

// PUT update event
router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(400).json({ message: "Error updating event" });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting event" });
  }
});

export default router;
