import { Router } from 'express';

import CustomerController from './customer/CustomerController';

let router = Router();

router.use('/customer', CustomerController);

export default router;