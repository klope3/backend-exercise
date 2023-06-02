import express from "express";
import { prisma } from "../prisma/db.setup.js";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import bcrypt from "bcrypt";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "./statusCodes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello wolrd");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(OK).send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    return res.status(BAD_REQUEST).send({ message: "Bad input" });
  } //should find a way to use zod for this
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  if (!user) {
    return res.status(NOT_FOUND).send({ message: "No such user" });
  }
  res.status(OK).send(user);
});

app.post(
  "/auth/login",
  validateRequest({
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
  }),
  async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!correctPassword) {
      return res.status(FORBIDDEN).send({ message: "Invalid password" });
    }

    res.status(OK).send({ message: "Authenticated" });
  }
);

app.listen(3000);
