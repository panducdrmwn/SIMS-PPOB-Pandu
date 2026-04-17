import { useState } from "react";
import show from "../../assets/eye-show.svg";
import hide from "../../assets/eye-crossed.svg";

export default function Saldo(balance) {
  const [balanceHidden, setBalanceHidden] = useState(true);

  const toggleBalanceVisibility = () => {
    setBalanceHidden(!balanceHidden);
  };

  return (
    <div className="bg-saldo-bg bg-cover flex flex-col justify-between bg-center w-1/2 h-40 text-white p-6 rounded-xl shadow">
      <p className="">Saldo Anda</p>
      <span className="text-2xl font-bold ">
        {balanceHidden ? "Rp ••••••••" : `Rp ${balance?.balance.toLocaleString()}`} 
      </span>
      <span
        className="pt-4 text-sm whitespace-pre cursor-pointer hover:underline flex flex-row items-center"
        onClick={toggleBalanceVisibility}
      >
        {balanceHidden ? "Lihat saldo "  : "Sembunyikan saldo "}
        {balanceHidden ? (
          <svg width="20px" height="20px" fill="none" viewBox="0 0 24 24"><path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2.999 3 18 18M9.843 9.914a3 3 0 0 0 4.265 4.22M6.5 6.646A10.02 10.02 0 0 0 2.457 12c1.274 4.057 5.065 7 9.542 7 1.99 0 3.842-.58 5.4-1.582m-6.4-12.369q.494-.049 1-.049c4.478 0 8.268 2.943 9.542 7a10 10 0 0 1-1.189 2.5"/></svg>
        ) : (
          <svg width="20px" height="20px" fill="none" viewBox="0 0 24 24"><path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.001 5C7.524 5 3.733 7.943 2.46 12c1.274 4.057 5.065 7 9.542 7 4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7"/></svg>
        )}
      </span>
    </div>
  );
}
