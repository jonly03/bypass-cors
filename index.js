import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `I am a web server. I am up & listening for HTTP requests on PORT:${PORT}. Send them!`
  );
});

app.use(cors());
app.use(bodyParser.json());

/*
proxy path to avoid cors errors
payload shape
- apiUrl
- methodToApi
- ?payloadToApi
- ?headers
*/
app.post("/", (req, res) => {
  if (!req.body) return res.status(400).json({ error: "missing payload" });
  const { apiUrl, methodToApi, payloadToApi, reqHeadersToApi } = req.body;

  if (!apiUrl || !methodToApi)
    return res
      .status(400)
      .json({ error: "apiUrl & methodApi are missing in your body payload" });

  let options = { method: methodToApi };

  if (payloadToApi) {
    options.body = JSON.stringify(payloadToApi);
  }

  if (reqHeadersToApi) {
    options.headers = { ...reqHeadersToApi };
  }

  fetch(apiUrl, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
});
