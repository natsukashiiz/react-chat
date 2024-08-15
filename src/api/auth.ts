import type { ServerResponse, LoginBody, Token, SignUpBody } from "@/types/api";
import { create } from "@/api/request";

const client = create();

export const login = (body: LoginBody): ServerResponse<Token> => {
  return client.post("/v1/auth/login", body);
};

export const sigup = (body: SignUpBody): ServerResponse<Token> => {
  return client.post("/v1/auth/signup", body);
};
