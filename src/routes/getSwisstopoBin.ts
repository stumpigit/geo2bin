/** src/routes/getSwisstopoBin.ts */
import express from 'express';
import controller from '../controllers/getSwisstopoBin';
const router = express.Router();

router.get('/swisstopo2bin/:lat', controller.getSwisstopoBin);

export = router;