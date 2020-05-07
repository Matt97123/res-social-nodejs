const Post = require('../models/post');

function savePost(req, res) {
  const { message } = req.body;
  console.log(req.body)

  if (message) {
    const post = new Post();
    const datec = new Date();
    const dateu = new Date();

    post.message = message;
    post.userid = null;
    post.createdat = datec.toDateString();
    post.updatedat = dateu.toDateString();

    post.save()
    .then(post => {
        res.status(200).send({ post });
    })
    .catch(error => res.status(500).send({ error }));

  }
  else {
    res.status(400).send({ message: `erreur message`});
  }
}

function getPosts(req, res) {
    Post.find().then(posts => {
      if (posts.length <= 0) {
        return res.status(404).send({ message: `Il n'y a pas de posts.` });
      }
  
      res.status(200).send({ posts });
    })
  }

function deletePost(req, res) {
    Post.remove({ _id: req.params.postId }, (err, post) => {
      if(err){
          res.send(err);
      }
      res.json({ message: 'Successfully deleted post!'});
    });
  }

module.exports = {
    savePost,
    getPosts,
    deletePost,
  };
  