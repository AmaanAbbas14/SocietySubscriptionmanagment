const express = require("express");
const cors = require("cors");
require("./utils/cronJobs");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const flatsRoutes = require("./routes/flatsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const usersRoutes = require("./routes/usersRoutes");
const monthlyRecordsRoutes = require("./routes/monthlyRecordsRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const residentRoutes = require("./routes/residentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flats", flatsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/monthly-records", monthlyRecordsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/resident", residentRoutes);

module.exports = app;