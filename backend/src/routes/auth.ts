import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '@middleware/auth';
import { validate, userRegisterSchema, userLoginSchema } from '@middleware/validation';
import * as userModel from '@models/user';
import jwt from 'jsonwebtoken';

const router = Router();

// Register
router.post('/register', validate(userRegisterSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const user = await userModel.createUser(email, password, first_name, last_name);
    const token = (jwt.sign as any)(
      { userId: user.id, email: user.email, role: user.role },
      (process.env.JWT_SECRET as string) || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', validate(userLoginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isPasswordValid = await userModel.verifyPassword(user.password_hash, password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = (jwt.sign as any)(
      { userId: user.id, email: user.email, role: user.role },
      (process.env.JWT_SECRET as string) || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (id !== req.user?.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || '1') || 1;
    const limit = parseInt((req.query.limit as string) || '20') || 20;

    const result = await userModel.getAllUsers(page, limit);

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
