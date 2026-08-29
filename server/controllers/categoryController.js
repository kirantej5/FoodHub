import Category from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadImage } from '../services/imageService.js';

export const getCategories = async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ name: 1 }).lean();
  sendSuccess(res, 200, 'Categories fetched', { categories });
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return sendError(res, 404, 'Category not found');
  sendSuccess(res, 200, 'Category fetched', { category });
};

export const createCategory = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = await uploadImage(req.file);
  const category = await Category.create(data);
  sendSuccess(res, 201, 'Category created', { category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return sendError(res, 404, 'Category not found');

  Object.assign(category, req.body);
  if (req.file) category.image = await uploadImage(req.file);
  await category.save();
  sendSuccess(res, 200, 'Category updated', { category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return sendError(res, 404, 'Category not found');
  sendSuccess(res, 200, 'Category deleted');
};
