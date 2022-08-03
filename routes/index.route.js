import { Router } from 'express';
import * as indexController from '../controllers/index.controller.js'

const router = Router();

router.get('/', indexController.getAllUsers);

export default router;
