import bcrypt from "bcrypt";
import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../prisma/db.setup.js";
import { createUserToken, getDataFromAuthToken } from "./auth-utils.js";
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
    return res.status(BAD_REQUEST).send({ message: "id must be a number" });
  }

  const split = req.headers.authorization?.split(" ");
  const badTokenMessage = "Invalid or missing token";

  if (!split || split.length < 2) {
    return res.status(BAD_REQUEST).send({ message: badTokenMessage });
  }

  const token = split[1];

  const tokenData = getDataFromAuthToken(token);
  if (!tokenData) {
    return res.status(BAD_REQUEST).send({ message: badTokenMessage });
  }

  const userWithRequestedId = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!userWithRequestedId) {
    return res.status(NOT_FOUND).send({ message: "User not found" });
  }

  if (userWithRequestedId.id !== tokenData.id) {
    return res.status(FORBIDDEN).send({ message: "Access denied" });
  }

  res.status(OK).send(userWithRequestedId);
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

    const token = createUserToken(user);

    res.status(OK).send({ token });
  }
);

app.listen(3000);
