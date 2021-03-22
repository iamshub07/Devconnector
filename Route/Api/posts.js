const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//@route GET api/post
//@desc Create a Post
//@access Private
router.post('/', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        //  console.log(user);
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});



//@route GET api/get
//@desc Get all Post
//@access Private
router.get('/', auth, async (req, res) => {

    try {
        const post = await Post.find();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/posts/id
//@desc Get Post by id
//@access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        if (!post) return res.status(400).json({ msg: 'There is no post for this id' });
        res.json(post);

    } catch (err) {
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'There is no post for this id' });

        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Delete api/posts/id
//@desc Delete Post by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).json({ msg: 'There is no post for this id' });
        //Check User
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not  authorized' });
        }
        await post.remove();
        res.json({ msg: "post removed" });

    } catch (err) {
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'There is no post for this id' });

        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Put api/posts/like/:id
//@desc Like Post by id
//@access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).json({ msg: 'There is no post for this id' });
        //Check User liked already
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);

    } catch (err) {


        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



//@route Put api/posts/unlike/:id
//@desc Like Post by id
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).json({ msg: 'There is no post for this id' });
        //Check User liked already
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post not yet liked' });
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);

    } catch (err) {


        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route Post api/posts/comment/:id
//@desc comment Post by id
//@access Private
router.post('/comment/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            //  const user = await (await User.findById(req.user.id)).Select('-password');
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);
            // if (!post) return res.status(400).json({ msg: 'There is no post for this id' });
            //Check User liked already
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);

        } catch (err) {


            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

//@route Delete api/posts/comment/:id/:comment_id
//@desc Delete comment Post by id
//@access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        //Check User liked already

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not  authorized' });
        }

        //Get remove index
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
    } catch (err) {


        console.error(err.message);
        res.status(500).send('Server Error');
    }
});







module.exports = router;