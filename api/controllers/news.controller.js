import e from "express";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getNewss = async (req, res) => {
    try {
        const newss = await prisma.news.findMany();

        res.status(200).json(newss);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to get Newss!' });
    }
}

export const getNews = async (req, res) => {

    const id = req.params.id;

    try {
        const news = await prisma.news.findUnique({
            where: { id },
            include: {
                paragraphs: true,
            }
        });


        res.status(200).json(news);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to get News!' });
    }
}

export const addNews = async (req, res) => {

    const { title, desc, image, paragraphs } = req.body;


    try {
        const newNews = await prisma.news.create({
            data: {
                title,
                desc,
                image,
                paragraphs: {
                    create: paragraphs.map((paragraph) => ({
                        text: paragraph.text,
                        image: paragraph.image || null, // Nếu không có `image`, đặt giá trị null
                    })),
                },
            },
            include: {  
                paragraphs: true
            }
        });
        res.status(200).json(newNews);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to add News!' });
    }
}

export const updateNews = async (req, res) => {


    try {
        res.status(200).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update News!' });
    }
};


export const deleteNews = async (req, res) => {

    const id = req.params.id;
    try {

        const news = await prisma.news.findUnique({
            where: { id },
        });

        if (!news) {
            return res.status(404).json({ message: 'News not found!' });
        }

        await prisma.newsParagraph.deleteMany({
            where: {
                newsId: id,
            },
        });

        await prisma.news.delete({
            where: { id },
        });



        res.status(200).json({ message: 'News deleted!' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to delete News!' });
    }
}