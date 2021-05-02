const app = express();
const cors = require("cors");
const database = require("./database");


router.get("/", (req, res) => {
    res.send({ message: "I am working on get request " }).status(200);
  });