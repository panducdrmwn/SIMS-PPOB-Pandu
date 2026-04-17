import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import Saldo from "./molecules/Saldo";
import Welcome from "./molecules/Welcome";
import { useModal } from "../contexts/ModalContext";
import logo from "../assets/Logo.png";
import check from "../assets/check.png";
import cross from "../assets/cross.png";
import {
  setBalance,
  setBalanceLoading,
  setBalanceError,
  updateBalance,
} from "../features/balanceSlice";
import { useNavigate } from "react-router-dom";

const presetAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

export default function TopUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);
  const { balance, loading: balanceLoading } = useSelector(
    (state) => state.balance,
  );
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAuthenticated && token) {
      dispatch(setBalanceLoading(true));
      // fetch balance
      axios
        .get("https://take-home-test-api.nutech-integrasi.com/balance", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status === 0) {
            dispatch(setBalance(res.data.data.balance));
          } else {
            dispatch(setBalanceError("Failed to fetch balance"));
          }
        })
        .catch((error) => {
          dispatch(setBalanceError(error.message));
        })
        .finally(() => {
          dispatch(setBalanceLoading(false));
        });
    }
  }, [isAuthenticated, token, dispatch]);

  const handlePreset = (value) => {
    setAmount(String(value));
  };

  const handlePay = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 10000) {
      toast.error("Minimum top up nominal 10.000");
      return;
    } else if (numericAmount > 1000000) {
      toast.error("Maximum top up nominal 1.000.000");
      return;
    }

    // Show confirmation modal
    const confirmId = openModal({
      id: "topup-confirm",
      src: logo,
      content: (
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-16 h-16" />
          <p className="text-lg mb-2">Anda yakin untuk Top Up sebesar</p>
          <p className="text-2xl font-bold text-black">
            {" "}
            Rp {numericAmount.toLocaleString()} ?
          </p>
        </div>
      ),
      size: "md",
      closable: true,
      footer: (
        <>
          <p
            onClick={() => {
              closeModal("topup-confirm");
              handleTopUp(numericAmount);
            }}
            className="py-2 font-semibold text-red-500 hover:bg-gray-300 rounded hover:cursor-pointer"
          >
            Ya, lanjutkan Top Up
          </p>
          <p
            onClick={() => closeModal("topup-confirm")}
            className="py-2 text-gray-400 font-semibold rounded hover:bg-gray-400 hover:text-gray-800 hover:cursor-pointer"
          >
            Batalkan
          </p>
        </>
      ),
    });
  };

  const handleTopUp = async (numericAmount) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/topup",
        { top_up_amount: numericAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status === 0) {
        // Success modal
        openModal({
          id: "topup-success",
          content: (
            <div className="text-center">
              <img
                src={check}
                alt="Success"
                className="mx-auto w-16 h-16 mb-8"
              />
              <p className="mb-2">Top Up sebesar </p>
              <p className="mb-2 text-2xl font-bold text-black">
                {" "}
                Rp {numericAmount.toLocaleString()}{" "}
              </p>
              <p>berhasil!</p>
            </div>
          ),
          size: "md",
          closable: true,
          footer: (
            <p
              onClick={() => closeModal("topup-success")}
              className="px-4 py-2 font-semibold text-red-500 hover:cursor-pointer"
            >
              Kembali ke beranda
            </p>
          ),
        });

        setAmount("");
        if (response.data.data?.balance != null) {
          dispatch(updateBalance(response.data.data.balance));
        } else {
          const balanceRes = await axios.get(
            "https://take-home-test-api.nutech-integrasi.com/balance",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (balanceRes.data.status === 0) {
            dispatch(updateBalance(balanceRes.data.data.balance));
          }
        }
      } else {
        // Error modal
        openModal({
          id: "topup-error",
          content: (
            <div className="text-center">
              <img src={cross} alt="Error" className="mx-auto w-16 h-16 mb-8" />
              <p className="text-lg">Top Up Gagal</p>
            </div>
          ),
          size: "md",
          closable: true,
          footer: (
            <p
              onClick={() => closeModal("topup-error")}
              className="px-4 py-2 font-semibold text-red-500 hover:cursor-pointer"
            >
              Kembali ke beranda
            </p>
          ),
        });
      }
    } catch (error) {
      console.log(error);
      // Error modal
      openModal({
        id: "topup-error",
        content: (
          <div className="text-center">
            <img src={cross} alt="Error" className="mx-auto w-16 h-16 mb-8" />
            <p className="text-lg">Top Up Gagal</p>
          </div>
        ),
        size: "md",
        closable: true,
        footer: (
          <p
            onClick={() => closeModal("topup-error")}
            className="px-4 py-2 font-semibold text-red-500 "
          >
            Kembali ke beranda
          </p>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[80%] mx-auto">
      <div className=" mx-auto mb-8">
        <div className="bg-white p-6 flex items-center justify-between">
          <Welcome user={user} />
          <Saldo balance={balance} />
        </div>
      </div>

      <div className=" mx-auto  p-6">
        <h3 className="text-xl">Silahkan masukkan</h3>
        <h2 className="text-2xl font-bold mt-4 mb-8">Nominal Top Up</h2>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col w-3/4">
            <div className="mb-4">
              <input
                id="topup-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className=" p-3 w-full border rounded-md"
                placeholder="Enter top up amount"
              />
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={!amount || Number(amount) <= 0 || loading}
              className={`w-full rounded-md px-4 py-3 text-white ${amount && Number(amount) > 0 && !loading ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
          <div className="w-1/4 mb-6 grid grid-cols-3 grid-rows-2 gap-x-3 gap-y-4 ">
            {presetAmounts.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => handlePreset(value)}
                className="rounded border border-gray-300 bg-gray-50 py-3 text-sm font-medium hover:bg-red-100"
              >
                Rp {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
