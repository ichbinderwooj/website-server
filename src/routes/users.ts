import { genSalt, hash } from 'bcrypt';
import { Router } from 'express';
import { User } from '../entity/user';

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find({
    select: ['id', 'username', 'createdAt', 'description', 'permission'],
  });
  res.status(200).json({ users });
});

router.post('/', async (req, res) => {
  if (typeof req.body.username === 'undefined') {
    res.status(400).json({
      message: 'No username specified.',
    });
    return;
  }

  if (!/^[A-Za-z]\w{5,29}$/.test(req.body.username)) {
    res.status(400).json({
      message: 'Invalid username.',
    });
    return;
  }

  if (typeof req.body.email === 'undefined') {
    res.status(400).json({
      message: 'No E-mail address specified.',
    });
    return;
  }

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g.test(
      req.body.email
    )
  ) {
    res.status(400).json({
      message: 'Invalid E-mail address.',
    });
    return;
  }

  if (typeof req.body.password === 'undefined') {
    res.status(400).json({
      message: 'No password specified.',
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(400).json({
      message:
        'Invalid password. (Password must contain six or more characters)',
    });
    return;
  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).json({
      message: 'Passwords do not match.',
    });
    return;
  }

  const usernameCheck = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (usernameCheck) {
    res.status(409).json({
      message: 'The specified username is already in use.',
    });
    return;
  }

  const emailCheck = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailCheck) {
    res.status(409).json({
      message: 'The specified E-mail address is already in use.',
    });
    return;
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

  res.status(201).json(outputUser);
});

router.get('/:id', async (req, res) => {
  const user = await User.findOne({
    where: {
      id: parseInt(req.params.id),
    },
    select: ['id', 'username', 'createdAt', 'description', 'permission'],
  });
  res.status(200).json(user);
});

export default router;
