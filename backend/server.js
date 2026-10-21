import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

console.log("GEMINI KEY CONFIGURED:", !!process.env.GEMINI_API_KEY);
console.log("MONGO_URI CONFIGURED:", !!process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production") {
  startServer();
}

export default app;
