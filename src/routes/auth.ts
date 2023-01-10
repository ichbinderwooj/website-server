import { compareSync } from 'bcrypt';
import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from '../entity/user';
import { jwt } from '../../config.json';
import { redisDB } from '../database';

const router = Router();

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
    select: ['id', 'email', 'password', 'permission'],
  });

  if (!user) {
    res.status(404).json({
      message: 'A user with the specified E-Mail address does not exist.',
    });
    return;
  }

  if (!compareSync(req.body.password, user.password)) {
    res.status(401).json({
      message: 'The specified password is incorrect.',
    });
    return;
  }

  const accessToken = sign(
    { id: user.id, permission: user.permission },
    jwt.accessTokenSecret,
    { expiresIn: '20m' }
  );
  const refreshToken = sign({ id: user.id }, jwt.refreshTokenSecret);

  await redisDB.connect();
  await redisDB.set(`rtokens:${refreshToken}`, refreshToken, {
    EX: 60 * 60 * 24 * 30,
  });
  await redisDB.disconnect();

  res.status(200).json({
    accessToken,
    refreshToken,
  });
});

export default router;
