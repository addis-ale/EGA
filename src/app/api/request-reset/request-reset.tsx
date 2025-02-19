import { NextApiRequest, NextApiResponse } from "next";
import prisma form '@lib/prismadb';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function POST(req:NextApiRequest,res:NextApiResponse) {

    const {email}=req.body;
    const user=prisma.user.findUnique({
        where:{UserEmail:email}
    })
    if(!user){
        return res.status(403).json({error:"user not found"})
    }
    
    const resettoken=crypto.randomBytes(32).toString("hex");
    const expires= new Date();
    expires.setHours(expires.getHours() + 1);


    await prisma.verficationToken.create({
        data:{ identifier:email  ,token:resettoken,expires}}
    )
     
    const transporter=nodemailer.createTransporter({
        service:"GMAIL",
        auth:{
            email:process.env.EMAIL,
            pass:process.env.PASS
        }
    })
            const resetPath=`${process.env.url}/reset/rest-password?token=${resettoken}`
        await transporter.sendEmail({
            from:process.env.EMAIL,
            to:email,
            subject:"password reset",
            html:`click ${resetPath} here to change your password`
        })

        res.status(200).json({message:"password reset send"});

    
}
