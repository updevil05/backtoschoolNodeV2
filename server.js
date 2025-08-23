const express = require("express");
const fs = require("fs").promises;
const sanitizeHtml = require("sanitize-html");
const path = require("path");
const { stories } = require("./data/stories.js");
const app = express();
app.use(express.json());
const PORT = 8000;

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));
app.get("/", async (req, res) => {
  const filePath = path.join(
    publicDir,
    req.url === "/" ? "index.html" : req.url
  );
  const content = await fs.readFile(filePath, "utf-8");
  res.type(path.extname(filePath));
  res.send(content);
});

app.get("/sightings", async (req, res) => {
  const data = await fs.readFile(
    path.join(__dirname, "data", "data.json"),
    "utf-8"
  );
  res.type("json").send(data);
});

app.post("/sightings", async (req, res) => {
  const sanitize = (str) =>
    sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });
  const newSighting = {
    title: sanitize(req.body.title),
    location: sanitize(req.body.location),
    text: sanitize(req.body.text),
  };
  const filePath = path.join(__dirname, "data", "data.json");
  const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
  data.push(newSighting);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  res.status(201).json({ message: "Sighting added" });
});

app.get("/api/news", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let i = 0;
  const sendStory = () => {
    res.write(`data:${JSON.stringify({ story: stories[i] })}\n\n`);
    i = (i + 1) % stories.length;
  };
  sendStory(); // ส่งเรื่องแรกทันที
  const intervalId = setInterval(sendStory, 2500); // ส่งทุก 2.5 วินาที

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});
app.listen(PORT, () => {
  console.log("Server start");
  console.log(publicDir);
});
