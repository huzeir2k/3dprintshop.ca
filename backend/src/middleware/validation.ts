import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const productSchema = Joi.object({
  sku: Joi.string().required(),
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional(),
  category_id: Joi.string().uuid().required(),
  price: Joi.number().positive().required(),
  cost: Joi.number().positive().optional(),
  stock_quantity: Joi.number().integer().min(0).required(),
  low_stock_threshold: Joi.number().integer().min(0).optional(),
  weight_kg: Joi.number().positive().optional(),
  dimensions_cm: Joi.string().optional(),
  image_url: Joi.string().uri().optional(),
  gallery_urls: Joi.array().items(Joi.string().uri()).optional(),
  is_active: Joi.boolean().optional(),
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional(),
  parent_category_id: Joi.string().uuid().optional(),
  is_active: Joi.boolean().optional(),
});

export const cartItemSchema = Joi.object({
  product_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().positive().required(),
});

export const createOrderSchema = Joi.object({
  shipping_address_id: Joi.string().uuid().required(),
  billing_address_id: Joi.string().uuid().required(),
  notes: Joi.string().optional(),
});

export const tutorialSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional(),
  content: Joi.string().optional(),
  category: Joi.string()
    .valid('3d-printing', 'cad-design', 'maintenance', 'troubleshooting', 'material-guide')
    .required(),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
});

export const playlistSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional(),
  cover_image_url: Joi.string().uri().optional(),
  is_published: Joi.boolean().optional(),
});

export const playlistItemSchema = Joi.object({
  tutorial_id: Joi.string().uuid().optional(),
  video_url: Joi.string().uri().optional(),
  video_title: Joi.string().required(),
  video_duration_seconds: Joi.number().integer().positive().optional(),
  description: Joi.string().optional(),
  sequence_order: Joi.number().integer().positive().required(),
  source: Joi.string().valid('youtube', 'vimeo', 'custom', 'internal').required(),
});

export function validate(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
      });
    }

    req.body = value;
    next();
  };
}
