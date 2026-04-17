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
import { setUser } from './features/userSlice';
import { setBalance, setBalanceLoading, setBalanceError } from './features/balanceSlice';
import axios from 'axios';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://take-home-test-api.nutech-integrasi.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        if (response.data.status === 0) {
          dispatch(loginSuccess(token));
          dispatch(setUser(response.data.data));

          // Fetch balance
          dispatch(setBalanceLoading(true));
          axios.get('https://take-home-test-api.nutech-integrasi.com/balance', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(balanceResponse => {
            if (balanceResponse.data.status === 0) {
              dispatch(setBalance(balanceResponse.data.data.balance));
            } else {
              dispatch(setBalanceError('Failed to fetch balance'));
            }
          }).catch(error => {
            dispatch(setBalanceError(error.message));
          }).finally(() => {
            dispatch(setBalanceLoading(false));
          });
        }
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [dispatch]);

  return (
    <>    <Navbar />    <Toaster position='top-center' toastOptions={{duration: 3000}}/>
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
