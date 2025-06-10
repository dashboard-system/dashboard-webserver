// test.ts
import express, { Request, Response } from "express";
const app = express();

app.get("/users/:id", (req: Request, res: Response) => {
  res.send("Test");
});

app.listen(3000, () => console.log("Running"));
console.log("test");
