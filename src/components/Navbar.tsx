import { Link, useLocation } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

export default function Navbar({ user }: { user: User | null }) {
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-[#00FF00] transition-colors">
            <Terminal size={24} />
            <span className="font-mono font-bold tracking-tighter text-lg">KRISH_SHAH</span>
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-8">
            <NavLink to="/" current={location.pathname}>HOME</NavLink>
            <NavLink to="/blog" current={location.pathname}>BLOG</NavLink>
            {user ? (
              <>
                <NavLink to="/admin" current={location.pathname}>ADMIN</NavLink>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-mono tracking-widest text-white/60 hover:text-red-400 transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <NavLink to="/login" current={location.pathname}>LOGIN</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, current }: { to: string, children: React.ReactNode, current: string }) {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`relative text-xs font-mono tracking-widest transition-colors ${
        isActive ? 'text-[#00FF00]' : 'text-white/60 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#00FF00]"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}
