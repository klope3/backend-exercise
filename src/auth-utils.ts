import { hash } from "bcrypt";

const saltRounds = 11;

export function hashPassword(password: string) {
  return hash(password, saltRounds);
}
