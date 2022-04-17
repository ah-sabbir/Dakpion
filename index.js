const express = require("express");
const Gun = require("gun");
const app = express();
const port = 3030;

app.use(Gun.serve);

app.get("/", (req, res) => {
  const messages = gun.get("messages");
  res.send(messages);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

Gun({ web: server });
