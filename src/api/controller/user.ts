import prisma from "../../lib/prisma";
import argon2 from 'argon2';
import { sendResponse, throwErrorResponse } from "../../utils/response";
import { APIError } from "../../exceptions";
import { Request, Response } from "express";
import HttpStatusCode from "../shared/status";

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, mobile, password }: { name: string, email: string, mobile: string, password: string } = req.body


            const doesExist = await prisma.user.findUnique({
                where: {
                    email: email
                },
                select: {
                    id: true
                }
            })


            if (doesExist) {
                throw APIError.Conflict('User with this email already exists')
            }

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: await argon2.hash(password),
                    userType: "admin"
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mobile: true,
                    userType: true
                }
            });

            if (!user) {
                throw APIError.BadRequest('User registration failed')
            }

            return sendResponse(res, "success", {
                status: HttpStatusCode.CREATED,
                message: "User registered successfully",
                data: user
            })

        } catch (err) {
            return throwErrorResponse(res, err)
        }
    }
}