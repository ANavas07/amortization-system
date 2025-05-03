import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import BrandLogo from '../images/brand-logo/brandlogoblack.png';
import { IoCameraOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { IMAGE_URL } from '../helpers/Constants';
import { bankT } from '../types';
import { FaRegMap } from 'react-icons/fa';
import useBank from '../hooks/useBank';

const initialData: bankT = {
  name: '',
  address: '',
  phone: '',
  email: '',
  slogan: '',
  logo: '',
};

const Profile = () => {

  const [bankInputs, setbankInputs] = useState<bankT>(initialData);
  const [dataFieldChanged, setDataFieldChanged] = useState(false);
  const [btnCancelPressed, setBtnCancelPressed] = useState(false);
  const [bankData, setBankData] = useState<bankT | null>(null);
  const {getBanks, updateBank} = useBank();
  //subir imagen
  //blob, imagen en tiempo real
  const [selectedBankImg, setSelectedBankImg] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  //Recuperar la imagen de la empresa.
  const localStorageData = localStorage.getItem('chaski-log');
  const logo = localStorageData && JSON.parse(localStorageData).logo ? `${IMAGE_URL}${JSON.parse(localStorageData).logo}` : BrandLogo;

  useEffect(()=>{
    const fetchBankData = async ()=>{
      const bankData = await getBanks();
      setbankInputs(bankData.msg[0]);
      setBankData(bankData.msg[0]);
    }

    fetchBankData();
  }, [btnCancelPressed]);

  const changeLogoValueLocalStorage = async () => {
    const localStorageData = localStorage.getItem('chaski-log'); // Leer los datos actuales del localStorage
    if (!localStorageData) {
      console.error("No se encontró el item 'chaski-log' en el localStorage.");
      return;
    }

    // Parsear los datos existentes
    const parsedData = JSON.parse(localStorageData);
    // Actualizar solo el valor de logo
    parsedData.logo = bankData?.logo;
    // Guardar los datos actualizados nuevamente en el localStorage
    localStorage.setItem('chaski-log', JSON.stringify(parsedData));
  };

  const handleCancelBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    cleanData();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setbankInputs({
      ...bankInputs,
      [e.target.name]: e.target.value
    })
    setDataFieldChanged(true);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBankImg(file);
      setPreviewImg(URL.createObjectURL(file)); // Guarda el archivo en el estado
      setDataFieldChanged(true);
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedBankImg) {
      await updateBank(bankInputs, selectedBankImg);
      changeLogoValueLocalStorage();
    } else {
      await updateBank(bankInputs);
    }

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const cleanData = () => {
    setbankInputs(initialData);
    setBtnCancelPressed(!btnCancelPressed);
    setDataFieldChanged(false);
  };

  useEffect(() => {
    if (btnCancelPressed) {
      cleanData();
    }
  }, [btnCancelPressed]);
  
  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit}>
          <div className="relative z-20 h-35 md:h-65">
            <img
              src={CoverOne}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            />
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <img src={previewImg || logo} alt="profile" className="h-[152px] w-[152px] object-contain rounded-full" />
                <label
                  htmlFor="logo"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <IoCameraOutline />
                  <input
                    type="file"
                    accept='image/*'
                    name="logo"
                    id="logo"
                    className="sr-only"
                    onChange={handleFiles}
                  />
                </label>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {bankInputs.name || 'Banco DevChickenBros'}
              </h3>
              <div className="w-full pt-4">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row ">
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="name"
                    >
                      Banco
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="name"
                        id="name"
                        value={bankInputs.name ?? ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[85%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="address"
                    >
                      Direccion
                    </label>
                    <div className="relative">

                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address"
                        id="address"
                        value={bankInputs.address ?? ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="phone"
                    >
                      telefono
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phone"
                        id="phone"
                        value={bankInputs.phone ?? ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="email"
                    >
                      email
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="email"
                        id="email"
                        value={bankInputs.email ?? ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Slogan */}
                <div className="w-full sm:w-[75%] mx-auto mb-10">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                    htmlFor="email"
                  >
                    Slogan
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="slogan"
                      id="slogan"
                      value={bankInputs.slogan ?? ''}
                      rows={4}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Slogan */}

                <div className="flex justify-center gap-4.5">
                  <button
                    className={`flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black ${dataFieldChanged ? 'hover:bg-zinc-400' : ''} dark:border-strokedark dark:text-white`}
                    type="button"
                    onClick={handleCancelBtn}
                    disabled={!dataFieldChanged}
                  >
                    Cancelar
                  </button>
                  <button
                    className={`flex justify-center rounded py-2 px-6 font-medium ${dataFieldChanged ? 'bg-primary text-gray hover:bg-opacity-90' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                    type="submit"
                    disabled={!dataFieldChanged}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
