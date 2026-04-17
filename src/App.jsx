import { Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import Purchase from './Components/Purchase';
import TopUp from './Components/TopUp';
import Transactions from './Components/Transactions';
import Account from './Components/Account';
import Navbar from './Components/Navbar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './features/authSlice';
import { setUser, fetchProfile } from './features/userSlice';
import { fetchBalance } from './features/balanceSlice';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
   
    if (token) {
      dispatch(fetchProfile(token))
        .unwrap()
        .then(() => {
          dispatch(loginSuccess(token));
          dispatch(fetchBalance(token));
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return (
    <>   
     <Navbar />   
     <Toaster position='top-center' toastOptions={{duration: 3000}}/>
     <Routes>
       <Route path='/' element={<Home/>} />
       <Route path='/login' element={<Login/>} />
       <Route path='/register' element={<SignUp/>}/>
       <Route path='/purchase/:serviceName' element={<Purchase/>}/>
       <Route path='/topup' element={<TopUp/>}/>
       <Route path='/transactions' element={<Transactions/>}/>
       <Route path='/account' element={<Account/>}/>
     </Routes>
    </>
  )
}

export default App
