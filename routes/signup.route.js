import { Router } from 'express';
import * as signupController from '../controllers/signup.controller.js'

const router = Router();

router.get('/', signupController.showForm);
router.post('/', signupController.handlePost);

export default router;
