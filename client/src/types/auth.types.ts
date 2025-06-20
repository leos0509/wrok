import type { BaseResponse } from "./global.types";
import type { User } from "./user";

export type SigninPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type SigninData = {
    token: string;
    user: User
}

export type SignupData = {
    user: User;
}

export type SignupResponse = BaseResponse<SignupData>


export type SigninResponse = BaseResponse<SigninData>;