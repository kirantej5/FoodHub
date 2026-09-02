import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

// Social icon components using inline SVG (lucide-react v0.400+ renamed these)
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

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
              <a href="#" className="hover:text-white transition-colors"><TwitterIcon /></a>
              <a href="#" className="hover:text-white transition-colors"><InstagramIcon /></a>
              <a href="#" className="hover:text-white transition-colors"><GithubIcon /></a>
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
