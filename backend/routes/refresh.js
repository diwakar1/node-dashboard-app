/**
 * refresh.js
 * Route for refreshing access tokens using a refresh token.
 */
import express from 'express';
import { refresh } from '../controllers/refreshController.js';

const router = express.Router();

router.post('/', refresh);

export default router;
