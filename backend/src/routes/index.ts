import express, { Router } from 'express';
import UserRouter from './UserRouter';
import EstagiarioRouter from './EstagiarioRouter';

const router: Router = express.Router();

router.use('/users', UserRouter);
router.use('/estagiarios', EstagiarioRouter);

export default router;
