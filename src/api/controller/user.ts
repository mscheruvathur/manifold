import prisma from "../../lib/prisma";
import argon2 from 'argon2';
import { sendResponse, throwErrorResponse } from "../../utils/response";
import { APIError } from "../../exceptions";
import { Request, Response } from "express";
import HttpStatusCode from "../shared/status";
import { Prisma } from "@prisma/client";

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, mobile, password } = req.body

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

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const doesExist = await prisma.user.findUnique({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    password: true,
                    email: true
                }
            });

            if (!doesExist) {
                throw APIError.NotFound('User with this email was not found')
            }

            if (await argon2.verify(doesExist.password, password)) {
                return sendResponse(res, 'success', {
                    status: HttpStatusCode.OK,
                    message: 'User logged in',
                    data: {
                        accessToken: "Not implemented",
                        refreshToken: "Not implemented",
                    }
                })
            }
        } catch (err) {
            return throwErrorResponse(res, err)
        }

    }

    
    static async update(req: Request, res: Response) {
        try {
            const {name, mobile} = req.body
            const {userId} = req.params

            const doesExist = await prisma.user.findUnique({
                where: {
                    id:userId
                },
                select: {
                    id: true
                }
            });

            if (!doesExist) {
                throw APIError.BadRequest('Invalid user Id')
            }

            const userUpdateInput: Prisma.UserUpdateInput = {}

            if (name) {
                userUpdateInput.name = name
            }

            if (mobile) {
                userUpdateInput.mobile = mobile
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: userUpdateInput,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mobile: true
                }
            })

            if (updatedUser) {
                return sendResponse(res, 'success', {
                    status: HttpStatusCode.OK,
                    message: "User profile updated successfully.",
                    data: updatedUser
                })
            }
            throw APIError.BadRequest('Failed to update user profile.')

        } catch (err) {
            return throwErrorResponse(res, err)
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        return res.status(200).send({ message: "API not implemented" })
    }

    static async resetPassword(req: Request, res: Response) {
        return res.status(200).send({ message: "API not implemented" })
    }
    static async logout(req: Request, res: Response) {
        return res.status(200).send({ message: "API not implemented" })
    }

}