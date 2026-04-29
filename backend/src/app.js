import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = 9000;
app.listen(port, () => {
  console.log("Server is listening on http://localhost:" + port + " .....");
});
