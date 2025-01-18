import e from "express";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getNewss = async (req, res) => {
    const { sort } = req.query;

    try {
        // Xác định thứ tự sắp xếp
        let orderBy = {};
        if (sort === 'Popular') {
            orderBy = { views: 'desc' }; // Sắp xếp lượt xem từ cao đến thấp
        } else if (sort === 'Oldest') {
            orderBy = { createdAt: 'asc' }; // Sắp xếp theo ngày cũ nhất
        } else {
            orderBy = { createdAt: 'desc' }; // Mặc định: ngày mới nhất
        }

        const newss = await prisma.news.findMany({
            orderBy, // Áp dụng thứ tự sắp xếp
        });

        res.status(200).json(newss);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to get Newss!' });
    }
};


export const getNews = async (req, res) => {

    const id = req.params.id;

    try {
        const news = await prisma.news.findUnique({
            where: { id },
           
        });


        res.status(200).json(news);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to get News!' });
    }
}

export const addNews = async (req, res) => {
    const { title, desc, image, content } = req.body;

    try {
        const newNews = await prisma.news.create({
            data: {
                title,
                desc,
                image,
                content, // Lưu toàn bộ nội dung bài viết (văn bản + hình ảnh)
            },
        });

        res.status(200).json(newNews);
    } catch (err) {
        console.error("Failed to add news:", err);
        res.status(500).send({ message: "Failed to add News!" });
    }
};


export const updateNews = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const body = req.body;

    try {

        const editedNews = await prisma.news.update({
            where: { id },
            data: {
                ...body,
            },
        });
        res.status(200).json(editedNews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update News!' });
    }
};

export const incrementViews = async (req, res) => {
    const id = req.params.id;

    try {
        // Tăng views thêm 1 đơn vị
        await prisma.news.update({
            where: { id },
            data: {
                views: {
                    increment: 1, // Tăng 1 đơn vị
                },
            },
        });

        res.status(200).send({ message: 'Views incremented successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to increment views!' });
    }
};


export const deleteNews = async (req, res) => {

    const id = req.params.id;
    try {

        await prisma.news.delete({
            where: { id },
        });

        res.status(200).json({ message: 'News deleted!' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to delete News!' });
    }
}