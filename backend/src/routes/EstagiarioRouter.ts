import { Router } from 'express';
import { cadEstagiario, deleteEstagiario, getEstagiarios, updateEstagiario } from '../components/Estagiario';
import { authenticateJWT } from '../config/auth/AuthMiddleware';

const router: Router = Router();
//@ts-ignore
//prettier-ignore
router.get('/', getEstagiarios);
// @ts-ignore
router.post('/', authenticateJWT, cadEstagiario);
// @ts-ignore
router.put('/:id/story', authenticateJWT, updateEstagiario);
// @ts-ignore
router.delete('/:id/story', authenticateJWT, deleteEstagiario);
//configurando o multer

export default router;
