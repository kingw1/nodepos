const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require("./controllers/PackageController"));
app.use(require("./controllers/MemberController"));

app.listen(port, () => {
  console.log(`api listening on port`, port);
});
