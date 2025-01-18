const app = require("./app");
const connectDb = require("./Config/db");
const dotenv = require("dotenv");

dotenv.config();
connectDb();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
