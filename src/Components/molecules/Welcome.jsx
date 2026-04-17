import defaultProfilePhoto from '../../assets/Profile Photo.png'

const Welcome = (user) => {
   
  return (
    <div className="flex flex-col items-start">
      <img
        src={
          user?.user?.profile_image ===
          "https://minio.nutech-integrasi.com/take-home-test/null"
            ? defaultProfilePhoto
            : user?.user?.profile_image
        }
        alt="Profile"
        className="w-16 h-16 rounded-full mr-4"
      />
      <div>
        <h1 className="pt-4 text-xl">Selamat datang,</h1>
        <p className="pt-3 font-semibold text-4xl"> {user?.user?.first_name} {user?.user?.last_name}</p>
      </div>
    </div>
  );
};

export default Welcome;
