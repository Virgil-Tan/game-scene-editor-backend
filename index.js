require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;


// use middleware to enhance app
app.use(cors());
app.use(express.json({
  limit: '50mb'
}))
app.use(fileUpload());


const usersRoutes = require("./modules/users/routes");
const mapsRoutes = require("./modules/maps/routes");
const materialsRoutes = require("./modules/materials/routes");
const tilesRoutes = require("./modules/tilesets/routes");

app.use("/api/users", usersRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/tiles", tilesRoutes);

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("MongoDB connected...");
  app.listen(PORT, () => {
    console.log(`The server set up at port: ${PORT}`);
  })
})
