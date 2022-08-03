import { Router } from 'express';
import * as loginController from '../controllers/login.controller.js'

const router = Router();

router.get('/', loginController.showForm);
router.post('/', loginController.handlePost);

export default router;
