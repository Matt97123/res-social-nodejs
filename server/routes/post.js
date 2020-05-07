const express = require('express');
const router = express.Router();
const { Route } = require('../models/route');

const postCtrl = require('../controllers/post');

const routes = [
  new Route({ path: '/post', method: 'post', controller: postCtrl.savePost }),
  new Route({ path: '/posts', method: 'get', controller: postCtrl.getPosts }),
  new Route({ path: '/post/:postId', method: 'delete', controller: postCtrl.deletePost }),
 ];

routes.map(({ path, method, controller }) => {
  switch (method) {
    case 'post': router.post(path, controller); break;
    case 'get': router.get(path, controller); break;
    case 'put': router.put(path, controller); break;
    case 'delete': router.delete(path, controller); break;
  }
});

module.exports = router;
