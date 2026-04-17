import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Welcome from "./molecules/Welcome";
import Saldo from "./molecules/Saldo";
import { fetchServices, fetchBanners } from "../features/homeSlice";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);
  const { balance } = useSelector((state) => state.balance);
  const { services, banners } = useSelector((state) => state.home);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAuthenticated && token) {
      dispatch(fetchServices(token));
      dispatch(fetchBanners(token));
    }
  }, [isAuthenticated, token, dispatch, navigate]);

  const selectService = (service) => {
    const serviceNameSlug = service.service_name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/purchase/${serviceNameSlug}`);
  };
 
  
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
