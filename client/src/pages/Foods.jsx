import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { foodApi, categoryApi } from '../api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';

export default function Foods() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data.data.categories || []));
  }, []);

  // The API request is an external synchronization; show its loading state when the query changes.
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setLoading(true);
    const params = {};
    if (categoryId) params.category = categoryId;
    if (searchParams.get('q')) params.search = searchParams.get('q');
    
    foodApi.getAll(params)
      .then(res => {
        setFoods(res.data.data.foods || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchParams.set('q', searchTerm);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const handleCategorySelect = (id) => {
    if (id) {
      searchParams.set('category', id);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="page-enter py-12">
      <div className="container-custom">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-4">Our Menu</h1>
          <p className="text-gray-400 mb-8">Discover the best food & drinks in your city</p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search for dishes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 py-3"
              />
            </div>
            <button type="submit" className="btn-primary py-3">Search</button>
          </form>
        </div>

        <div className="mb-8 border-b border-zinc-800 pb-2">
          <CategoryFilter 
            categories={categories} 
            selected={categoryId} 
            onSelect={handleCategorySelect} 
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400 font-medium">
            Showing <span className="text-white">{foods.length}</span> results
          </p>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-0 h-[320px] flex flex-col">
                <div className="h-48 skeleton rounded-none" />
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="h-6 skeleton w-3/4" />
                  <div className="h-4 skeleton w-full" />
                  <div className="mt-auto h-8 skeleton w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Search size={40} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No food found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
