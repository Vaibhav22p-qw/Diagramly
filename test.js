const mongoose = require("mongoose");

const uri =
  "mongodb+srv://vaibhav2027p_db_user:VAib33@cluster0.yy5cwza.mongodb.net/diagramly?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });