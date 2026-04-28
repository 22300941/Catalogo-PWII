import express from 'express';
import { createOrder, captureOrder } from '../controlador/paypal.controller.js';

const router = express.Router();

router.post('/crear-orden', createOrder);
router.post('/capturar-orden', captureOrder);

export default router;