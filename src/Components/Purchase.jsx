import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Welcome from "./molecules/Welcome";
import Saldo from "./molecules/Saldo";
import { useModal } from "../contexts/ModalContext";
import logo from "../assets/Logo.png";
import check from "../assets/check.png";
import cross from "../assets/cross.png";
import { updateBalance } from "../features/balanceSlice";

export default function Purchase() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);
  const { balance } = useSelector((state) => state.balance);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch services
    axios
      .get("https://take-home-test-api.nutech-integrasi.com/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === 0) {
          setServices(res.data.data);
          // Find the selected service from the URL parameter
          const service = res.data.data.find(
            (s) => s.service_name.toLowerCase().replace(/\s+/g, '-') === serviceName
          );
          if (service) {
            setSelectedService(service);
            setPaymentAmount(String(service.service_tariff || ""));
          } else {
            navigate("/");
          }
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, [isAuthenticated, token, serviceName, navigate]);

  const handleTransaction = async () => {
    if (!selectedService) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return;

    const confirmId = openModal({
      id: "payment-confirm",
      title: "Konfirmasi Pembayaran",
      content: (
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-16 h-16" />
          <p className="text-lg mb-2">Beli {selectedService.service_name} sebesar</p>
          <p className="text-2xl font-bold text-black">Rp {amount.toLocaleString()} ?</p>
        </div>
      ),
      size: "md",
      closable: true,
      footer: (
        <>
          <button
            onClick={() => {
              closeModal("payment-confirm");
              handlePayment(amount);
            }}
            className="px-4 py-2  text-red-500 font-semibold rounded hover:bg-gray-100"
          >
            Ya, lanjutkan Bayar
          </button>
          <button
            onClick={() => closeModal("payment-confirm")}
            className="px-4 py-2 text-gray-400 font-semibold rounded hover:bg-gray-100"
          >
            Batalkan
          </button>
        
        </>
      ),
    });
  };

  const handlePayment = async (amount) => {
    setPayLoading(true);
    try {
      const response = await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/transaction",
        {
          service_code: selectedService.service_code,
          amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status === 0) {
        // Success modal
        openModal({
          id: "payment-success",
          title: "Pembayaran Berhasil",
          content: (
            <div className="text-center">
              <img
                src={check}
                alt="Success"
                className="mx-auto w-16 h-16 mb-8"
              />
              <p className="mb-4">
                Pembayaran {selectedService.service_name} sebesar{" "}
              </p>
              <p className="mb-4 text-2xl font-bold text-black">
                {" "}
                Rp {amount.toLocaleString()}{" "}
              </p>
              <p>berhasil!</p>
            </div>
          ),
          size: "md",
          closable: true,
          footer: (
            <button
              onClick={() => {
                closeModal("payment-success");
                navigate("/");
              }}
              className="px-4 py-2 text-red-500 font-semibold rounded hover:bg-gray-100"
            >
              Kembali ke beranda
            </button>
          ),
        });

        // Update saldo
        axios
          .get("https://take-home-test-api.nutech-integrasi.com/balance", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.status === 0) {
              dispatch(updateBalance(res.data.data.balance));
            }
          })
          .catch(console.error);
      } else {
        // Error modal
        openModal({
          id: "payment-error",
          title: "Pembayaran Gagal",
          content: (
            <div className="text-center">
              <img src={cross} alt="Error" className="mx-auto w-16 h-16 mb-8" />
              <p className="text-lg">
                Pembayaran {selectedService.service_name} Gagal
              </p>
            </div>
          ),
          size: "md",
          closable: true,
          footer: (
            <button
              onClick={() => closeModal("payment-error")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              OK
            </button>
          ),
        });
      }
    } catch (error) {
      console.error(error);
      // Error modal
      openModal({
        id: "payment-error",
        title: "Pembayaran Gagal",
        content: "Terjadi kesalahan saat memproses pembayaran",
        size: "md",
        closable: true,
        footer: (
          <button
            onClick={() => closeModal("payment-error")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            OK
          </button>
        ),
      });
    } finally {
      setPayLoading(false);
    }
  };

  if (!selectedService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[80%] mx-auto">
      {/* profil dan saldo */}
      <div className="mx-auto mb-8">
        <div className="bg-white p-6 flex items-center justify-between">
          <Welcome user={user} />
          <Saldo balance={balance} />
        </div>
      </div>

      {/* Payment section */}
      <div className="mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 px-6">Pembayaran</h2>
        <div className="p-6">
          <div className="mb-4 flex flex-row items-center">
            <img
              src={selectedService.service_icon}
              alt={selectedService.service_name}
              className="w-16 h-16 mr-4"
            />
            <p className="text-xl font-semibold">
              {selectedService.service_name}
            </p>
          </div>
          <div className="mb-4">
            <input
              id="payment-amount"
              type="number"
              min="0"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="p-3 w-full border rounded-md"
              placeholder="Masukkan nominal pembayaran"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTransaction}
              disabled={
                !paymentAmount || Number(paymentAmount) <= 0 || payLoading
              }
              className={`rounded w-full px-5 py-3 text-white ${
                paymentAmount && Number(paymentAmount) > 0 && !payLoading
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {payLoading ? "Processing..." : "Bayar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}