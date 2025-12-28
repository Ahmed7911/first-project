import { Router } from "express";
import { createPost, deletepost, getPosts , updatePost} from "../controllers/post.controller.js";

const router = Router();

router.route('/createpost').post(createPost);
router.route('/getPosts').get(getPosts);
router.route('/update/:id').patch(updatePost);
router.route('/delete/:id').delete(deletepost);

export default router;