import { randomBytes } from "crypto";

export function generateToken() {
     const token = randomBytes(4).toString("hex"); 
     return token
}