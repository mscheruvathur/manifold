import { JWTPayload } from "jose";
import { UserType } from "@prisma/client";


export interface IAccessTokenPayload extends JWTPayload {
    name?: string;
    email?: string;
    utk?: string;
    uuid?: string;
    userType?: UserType;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    jti?: string;
    nbf?: number;
    exp?: number;
    iat?: number;
    scopes?: string
}

export interface IRefreshTokenPayload extends JWTPayload {
    key?: string;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    jti?: string;
    nbf?: number;
    exp?: number;
    iat?: number;
}

export interface HttpEquivalentPrismaError {
    httpStatus?: number;
    message?: string;
    error?: {
        key: string;
        errorMessage: string;
    };
}
