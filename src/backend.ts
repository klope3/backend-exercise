import express from "express";
import { prisma } from "../prisma/db.setup.js";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {} from "zod/";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello wolrd");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    return res.status(400).send({ message: "Bad input" });
  } //should find a way to use zod for this
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  if (!user) {
    return res.status(404).send({ message: "No such user" });
  }
  res.status(200).send(user);
});

app.listen(3000);
