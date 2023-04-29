const express = require('express');
const commentsRouter = express.Router();
const { createCommentsCtrl,
    singleCommentsCtrl,
    deleteCommentsCtrl,
    updateCommentsCtrl} = require("../../controllers/comments/commentsCtrl")

//POST/api/v1/comments
commentsRouter.post('/', createCommentsCtrl);

//GET/api/v1/comments/:id
commentsRouter.get('/:id', singleCommentsCtrl);


//DELETE/api/v1/comments/:id
commentsRouter.delete('/:id', deleteCommentsCtrl);

//PUT/api/v1/comments/:id
   
    commentsRouter.put('/:id', updateCommentsCtrl );

module.exports = commentsRouter;