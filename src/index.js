import express from "express";
import { matchesRouter } from "./routes/matches";

const app = express();
const PORT = 8000;

// enable express to understand json data
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/matches", matchesRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
