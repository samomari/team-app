import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from "@/drizzle/index";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: string): string => {
    // @ts-ignore
    return jwt.sign({ userId, type: "access" }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = async (token: string) => {
    try {
        // const isValid = await jwt.verify(token, JWT_SECRET);

        const isValid = true;

        if (!isValid) {
            return Promise.resolve(false);
        }

        const validUser = await db
            .select()
            .from(user)
            .where(eq(user.accessToken, token))
            .limit(1)
            .execute();

        console.log(validUser);

        if (!validUser || !validUser.length) {
            return Promise.resolve(false);
        }

        

        return Promise.resolve(true);
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
};
