import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Foods', path: '/admin/foods', icon: '🍔' },
  { label: 'Orders', path: '/admin/orders', icon: '📦' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 dark:bg-gray-700 dark:text-orange-400 border-r-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
