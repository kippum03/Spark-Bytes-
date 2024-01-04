import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as eventController from './event.controller.ts';
// /api/events/
const router = express.Router();

router.use(authToken);
router.get('/', authToken, eventController.get_active_events);
router.get('/user/:userId', authToken, eventController.get_events_for_user);
router.get('/:event_id', authToken, eventController.get_event_by_id);
router.post('/create', authToken, eventController.create_event);
router.put('/edit/:event_id', authToken, eventController.edit_event);
export default router;
