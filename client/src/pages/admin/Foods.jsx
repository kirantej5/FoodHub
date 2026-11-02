import { useState, useEffect } from 'react';
import { foodApi, adminApi, categoryApi, restaurantApi } from '../../api';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '', restaurant: '',
  preparationTime: '', isAvailable: true, isFeatured: false,
  image: null,
};

function FoodModal({ food, categories, restaurants, onClose, onSaved }) {
  const [form, setForm] = useState(food ? {
    name: food.name,
    description: food.description || '',
    price: food.price,
    category: food.category?._id || food.category || '',
    restaurant: food.restaurant?._id || food.restaurant || '',
    preparationTime: food.preparationTime || '',
    isAvailable: food.isAvailable ?? true,
    isFeatured: food.isFeatured ?? false,
    image: null,
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(food?.image?.url || null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.restaurant) {
      toast.error('Please select a restaurant');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('restaurant', form.restaurant);
      fd.append('preparationTime', form.preparationTime);
      fd.append('isAvailable', form.isAvailable);
      fd.append('isFeatured', form.isFeatured);
      if (form.image) fd.append('image', form.image);

      if (food) {
        await adminApi.updateFood(food._id, fd);
        toast.success('Food updated!');
      } else {
        await adminApi.createFood(fd);
        toast.success('Food created!');
      }
      onSaved();
      onClose();
    } catch {
      toast.error('Failed to save food');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {food ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Preview */}
          <div className="flex flex-col items-center gap-3">
            {preview && <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-xl border dark:border-gray-600" />}
            <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-500 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              📷 {preview ? 'Change Image' : 'Upload Image'}
              <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          {/* Price and Prep Time side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prep Time (min)</label>
              <input type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange} min="1"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          </div>

          {/* Category & Restaurant */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant *</label>
              <select name="restaurant" value={form.restaurant} onChange={handleChange} required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Select restaurant...</option>
                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange}
                className="w-4 h-4 text-orange-500 rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                className="w-4 h-4 text-orange-500 rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : (food ? 'Update Food' : 'Create Food')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { food: null | object }

  const fetchFoods = async () => {
    try {
      const [foodsRes, catsRes, restsRes] = await Promise.all([
        foodApi.getAll({ limit: 100 }),
        categoryApi.getAll(),
        restaurantApi.getAll({ limit: 100 }),
      ]);
      if (foodsRes.data.success) setFoods(foodsRes.data.data.foods);
      if (catsRes.data.success) setCategories(catsRes.data.data.categories);
      if (restsRes.data.success) setRestaurants(restsRes.data.data.restaurants || restsRes.data.data);
    } catch {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  // The API request is an external synchronization required when the admin page mounts.
  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => { fetchFoods(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      const res = await adminApi.deleteFood(id);
      if (res.data.success) { toast.success('Food deleted'); fetchFoods(); }
    } catch { toast.error('Failed to delete food'); }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div>
      {modal && (
        <FoodModal
          food={modal.food}
          categories={categories}
          restaurants={restaurants}
          onClose={() => setModal(null)}
          onSaved={fetchFoods}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Foods</h1>
        <button
          onClick={() => setModal({ food: null })}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Food
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Available</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    {food.image?.url
                      ? <img src={food.image.url} alt={food.name} className="w-12 h-12 object-cover rounded-lg" />
                      : <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-lg">🍽️</div>
                    }
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{food.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{food.restaurant?.name || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">${food.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{food.category?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${food.isAvailable ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                      {food.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <button
                      onClick={() => setModal({ food })}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No food items found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
