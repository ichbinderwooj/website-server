import { genSalt, hash } from 'bcrypt';
import { Router } from 'express';
import { User } from '../entity/user';
import { UserRequest } from '../interfaces/user-request';

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find({
    select: ['id', 'username', 'createdAt', 'description', 'permission'],
  });
  return res.status(200).json({ users });
});

router.post('/', async (req, res) => {
  if (typeof req.body.username === 'undefined') {
    return res.status(400).json({
      message: 'No username specified.',
    });
  }

  if (!/^[A-Za-z]\w{5,29}$/.test(req.body.username)) {
    return res.status(400).json({
      message: 'Invalid username.',
    });
  }

  if (typeof req.body.email === 'undefined') {
    return res.status(400).json({
      message: 'No E-mail address specified.',
    });
  }

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g.test(
      req.body.email
    )
  ) {
    return res.status(400).json({
      message: 'Invalid E-mail address.',
    });
  }

  if (typeof req.body.password === 'undefined') {
    return res.status(400).json({
      message: 'No password specified.',
    });
  }

  if (req.body.password.length < 6) {
    return res.status(400).json({
      message:
        'Invalid password. (Password must contain six or more characters)',
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match.',
    });
  }

  const usernameCheck = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (usernameCheck) {
    return res.status(409).json({
      message: 'The specified username is already in use.',
    });
  }

  const emailCheck = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailCheck) {
    return res.status(409).json({
      message: 'The specified E-mail address is already in use.',
    });
  }

  const salt = await genSalt(10);
  const passwordHash = await hash(req.body.password, salt);

  const user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = passwordHash;
  await user.save();

  const outputUser = await User.findOne({
    where: {},
    select: [
      'id',
      'username',
      'email',
      'createdAt',
      'description',
      'permission',
    ],
    order: { id: 'DESC' },
  });

  return res.status(201).json(outputUser);
});

router.get('/:id', async (req: UserRequest, res) => {
  const user = await User.findOne({
    where: {
      id: parseInt(req.params.id),
    },
    select:
      req.user &&
      (req.user.id == parseInt(req.params.id) || req.user.permission >= 9)
        ? ['id', 'username', 'email', 'createdAt', 'description', 'permission']
        : ['id', 'username', 'createdAt', 'description', 'permission'],
  });
  if (!user)
    return res.status(404).json({
      message: 'This user does not exist.',
    });
  return res.status(200).json(user);
});

export default router;
