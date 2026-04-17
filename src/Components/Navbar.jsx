import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { clearUser } from '../features/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="border-b-2 p-4">
      <div className="max-w-8xl container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="h-8" />
          <span>SIMS PPOB</span>
        </div>
        <div className="space-x-12">
          <button onClick={() => navigate('/topup')} className={`hover:underline font-semibold ${location.pathname === '/topup' ? 'text-red-500' : ''}`}>Top Up</button>
          <button onClick={() => navigate('/transactions')} className={`hover:underline font-semibold ${location.pathname === '/transactions' ? 'text-red-500' : ''}`}>Transactions</button>
          <button onClick={() => navigate('/account')} className={`hover:underline font-semibold ${location.pathname === '/account' ? 'text-red-500' : ''}`}>Akun</button>
        </div>
      </div>
    </nav>
  );
}