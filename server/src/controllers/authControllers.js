import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { Prisma } from "@prisma/client";

const register = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return res.status(400).json({
                error: "User already exists with this email!"
            });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                surname,
                email,
                password: hashedPassword
            },
        });

            // GENERATE TOKEN JWT ICI AVANT DE SEND LE STATUS
        const token = generateToken(user.id, user.role, res);

        res.status(201).json({
            status: "success",
            data:{
                user:{
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
            
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: "Internal server error"
        })
    };
};




                ///////// LOGIN ////////
const login = async (req, res) => {

    try{
        const { email, password } = req.body;


        // check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });


        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        };


        // VERIFY THE PASSWORD
        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: "Invalid email or password"
            })
        };

        const token = generateToken(user.id, user.role, res);

        res.status(200).json({
            status:"success",
            data: {
                user: {
                    id: user.id,
                    email: email,
                    role: user.role,
                },
                token,
            },
        });
    }catch(error){
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: "Internal server error" });
    };
};



            //////// LOGOUT ///////
const logout = async (req, res) => {
    // "jwt" = ""
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),   // time now
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });


    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};


const getMe = async (req, res) => {
    if (req.user) {
        res.status(200).json({
            status: "success",
            data: { user: req.user }
        });
    } else {
        res.status(404).json({ error: "User not found" });
    }
}
export { register, login, logout, getMe };