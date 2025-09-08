import { Router } from 'express';
import { UserComponent } from '../components';
import { authenticateJWT } from '../config/auth/AuthMiddleware';

const router: Router = Router();

router.post('/createUser', UserComponent.createUser);
router.post('/login', UserComponent.loginUser);
//@ts-ignore
router.delete('/deleteUser/:id', authenticateJWT, UserComponent.deleteUser);
//@ts-ignore
router.get('/user/:id', authenticateJWT, UserComponent.getUser);
//@ts-ignore
router.get('/getAll', authenticateJWT, UserComponent.getAllUsers);
//@ts-ignore
router.put('/user/:id', authenticateJWT, UserComponent.putUser);

//@ts-ignore
router.get('/getAll', authenticateJWT, UserComponent.getAllUsers);

export default router;
