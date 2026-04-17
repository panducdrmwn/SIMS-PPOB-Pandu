import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Welcome from "./molecules/Welcome";
import Saldo from "./molecules/Saldo";

export default function Transactions() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);
  const balance = useSelector((state) => state.balance.balance);
  const navigation = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = async (nextOffset) => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${nextOffset}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.status === 0) {
        const nextRecords = res.data.data.records || [];
        setTransactions((prev) =>
          nextOffset === 0 ? nextRecords : [...prev, ...nextRecords],
        );
        setHasMore(nextRecords.length === limit);
        setOffset(nextOffset);
      } else {
        setError(res.data.message || "Failed to load transactions");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    loadTransactions(0);
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    navigation("/login");
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-[80%] mx-auto">
        <div className="bg-white p-6  flex items-center justify-between">
          <Welcome user={user} />
          <Saldo balance={balance} />
        </div>
        <div className=" p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Semua Transaksi</h1>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-600">
              Loading transactions...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No transactions.
            </div>
          ) : (
            <>
              <div className="divide-y">
                {transactions.map((tx, index) => (
                  <div
                    key={tx.id || index}
                    className="my-4 border rounded-xl p-6 sm:flex sm:justify-between sm:items-center"
                  >
                    <div className="sm:flex-1">
                      <p className={`text-xl font-semibold ${tx.transaction_type === "TOPUP" ? "text-green-600" : "text-red-600"}`}>
                       {tx.transaction_type === "TOPUP" ? "+" : "-"} Rp {(tx.total_amount || 0).toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(tx.created_on || "").toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2"></p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:text-right">
                      <p className=" font-semibold">
                        {tx.description || tx.note || "Payment history record"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="p-6 text-center">
                  <p
                    onClick={() => loadTransactions(offset + limit)}
                    className=" px-5 py-2 text-red-600 hover:bg-gray-400 hover:cursor-pointer"
                  >
                    Show More
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
