const router = require('express').Router();
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/handleImages')
const path = require('path');

router.get('/posts',async (req,res)=>{
    const {page = 1, search} = req.query;
    try{
        let data;
        if(search)data = (await Blog.find({"title" : {$regex : search, $options: '-i'}}).skip((page-1) * 5).limit(5));
        else data = (await Blog.find().skip((page-1) * 5).limit(5));
        res.status(200).json({
            status: 'Success',
            result: [...data]
        });
    }
    catch(e){
        res.status(400).json({
            status: 'Failure',
            message: e.message
        })
    }
})

router.post('/posts', [
    body('title').isLength({min: 5}),
    body('body').isLength({min: 5})
], upload.single('image'), async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const data = {
            title: req.body.title,
            body: req.body.body,
            image: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            user: req.user
        }
        const post = await Post.create(data);
        return res.status(201).json({
            status: 'Success',
            post
        })
    }
    catch(e){
        return res.status(500).json({
            status: 'Failure',
            message: e.message
        })
    }
})
