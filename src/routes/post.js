const router = require('express').Router();
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/handleImages')

router.get('/posts',async (req,res)=>{
    const {page = 1, search} = req.query;
    try{
        let data;
        if(search)data = (await Post.find({"title" : {$regex : search, $options: '-i'}}).skip((page-1) * 5).limit(5));
        else data = (await Post.find().skip((page-1) * 5).limit(5));
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

router.post('/posts',upload, [
    body('title').isLength({min: 5}),
    body('body').isLength({min: 5})
], (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'Failure',
            message: errors.array()
        })
    }
    const obj = {
        title: req.body.title,
        body: req.body.body,
        image: {
            data: req.file.filename,
            contentType: 'image/png'
        },
        user: req.user
    }
    Post.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.status(201).json({
                status: 'Success',
                message: 'Post created successfully'
            })
        }
    });
});

router.put('/posts/:id', upload, async (req, res)=>{
    console.log(req.body)
    try{
        let post = await Post.findOne({ "_id": req.params.id});
        if(post.user.toString() != req.user){
            return res.status(400).json({
                status: 'Failure',
                message: 'You cannot edit someone else posts'
            })
        }
        post = await Post.updateOne({'_id' : req.params.id}, {$set : req.body})
        return res.status(202).json({
            status: 'Success',
            result: post
        })
    }catch(e){
        return res.status(500).json({
            status: 'Failure',
            message: e.message
        })
    }
})
router.delete('/posts/:id', async (req, res)=>{
    try{
        let post = await Post.findOne({ "_id": req.params.id});
        if(post.user.toString() != req.user){
            return res.status(400).json({
                status: 'Failure',
                message: 'You cannot delete someone else posts'
            })
        }
        post = await Post.deleteOne({ "_id": req.params.id})
        return res.status(202).json({
            status: 'Success',
            result: post
        })
    }catch(e){
        return res.status(500).json({
            status: 'Failure',
            message: e.message
        })
    }
})

module.exports = router