import { UtensilsCrossed, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t py-12" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-black text-xl mb-4" style={{ color: '#f97316' }}>
              <UtensilsCrossed size={24} />
              <span>Food<span style={{ color: 'var(--color-text)' }}>Hub</span></span>
            </Link>
            <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>
              Order delicious food from the best restaurants near you. Fast delivery, great taste.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-orange-500 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-orange-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe for offers and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="input-field py-2" />
              <button className="btn-primary py-2 px-4">Sub</button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-gray-500" style={{ borderColor: 'var(--color-border)' }}>
          © {new Date().getFullYear()} FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
