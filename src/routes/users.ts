import { Router } from 'express';
import { User } from '../entity/user';

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find({
    select: ['id', 'username', 'createdAt', 'description', 'permission'],
  });
  res.status(200).json({ users });
});

export default router;
