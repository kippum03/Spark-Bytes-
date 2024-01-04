import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as tagController from './tags.controller.ts';

const router = express.Router();

router.use(authToken);

router.get('/', authToken, tagController.get_tags);
router.post('/create', authToken, tagController.create_tag);
router.post('/type/create', authToken, tagController.tag_type_create);
router.get('/type', authToken, tagController.get_tag_types_by_name);
router.get('/type/all', authToken, tagController.get_all_tag_types);
export default router;
