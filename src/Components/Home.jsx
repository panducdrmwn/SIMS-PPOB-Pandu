import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Welcome from "./molecules/Welcome";
import Saldo from "./molecules/Saldo";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);
  const { balance } = useSelector((state) => state.balance);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Fetch services
      axios
        .get("https://take-home-test-api.nutech-integrasi.com/services", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status === 0) {
            setServices(res.data.data);
          }
        })
        .catch(console.error);

      // Fetch promos
      axios
        .get("https://take-home-test-api.nutech-integrasi.com/banner", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status === 0) {
            setBanners(res.data.data);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, token]);

  const selectService = (service) => {
    // Navigate to purchase page 
    const serviceNameSlug = service.service_name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/purchase/${serviceNameSlug}`);
  };

  if (!isAuthenticated) {
    navigate("/login");
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

      {/* services */}
      <div className="w-full mx-auto mb-8">
        <div className="flex flex-row w-full overflow-x-auto space-x-4 pb-4">
          {services.map((service) => (
            <button
              key={service.service_code}
              type="button"
              onClick={() => selectService(service)}
              className="w-full flex flex-col items-center justify-start text-center hover:bg-blue-50 p-4 rounded-lg "
            >
              <img
                src={service.service_icon}
                alt={service.service_name}
                className="w-20 h-20 mx-auto mb-2"
              />
              <p className="text-sm font-medium">{service.service_name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* promos */}
      <div className="mx-auto">
        <h2 className="text-xl font-bold mb-4">Temukan promo menarik</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {banners.map((banner) => (
            <div
              key={banner.banner_name}
              className="bg-white p-4 rounded shadow min-w-[300px]"
            >
              <img
                src={banner.banner_image}
                alt={banner.banner_name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
