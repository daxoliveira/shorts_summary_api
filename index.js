import cors from "cors"
import express from "express"
import * as path from "path"
import { download } from "./download.js"
import { transcribe } from "./transcribe.js"
import { summarize } from "./summarize.js"
import { convert } from "./convert.js"

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())

const allowedOrigins = [
  'https://shorts-summary-client.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions))

app.all('*', (req, res) => {
  res.status(400)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found'})
  } else {
    res.type('txt').send('404 Not Found')
  }
});

app.get("/", (request, response) => {
  return response.json({ message: "Hello World!" })
})

app.get("/summary/:id", async (req, res) => {
  try {
    await download(req.params.id);
    const audioConverted = await convert();
    const result = await transcribe(audioConverted);

    return res.json({ result });
  } catch (error) {
    console.error(`Error in /summary/:id route: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/summary", async (req, res) => {
  try {
    const result = await summarize(req.body.text)
    return res.json({ result })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
})

app.listen(3333, () => console.log("Server running on port 3333!"))
