import React, { useEffect, useState} from 'react';
import { useAuthContext } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AmortizationPopup from '../../modals/amortizationPopUp';

const CreditTypes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;
  }, [authUser]);

  const openModal =()=>{
    setIsModalOpen(true);
  };

  const closeModal =()=>{
    setIsModalOpen(false);
  }


  return (
    <>
      <Breadcrumb pageName="¿Que tipo de credito necesitas?" />
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-center md:items-center lg:gap-12 mt-4 text-black dark:text-white">
        <select defaultValue="Pick a color" className="select  rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
          <option disabled>¿Que tipo de credito necesitas?</option>
          <option>Consumo (Personal)</option>
          <option>Vehicular</option>
          <option>Hipotecario (Vivienda)</option>
          <option>Microcrédito</option>
          <option>Quirografario </option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row border-stroke bg-transparent rounded-lg shadow-md max-w-6xl mx-auto mt-8">
        {/* Left Column - Input Form */}
        <div className="w-full md:w-1/2 p-6 border-stroke bg-transparent rounded-l-lg text-black dark:text-white">
          <div className="mb-6">
            <label htmlFor="loanAmount" className="block text-sm font-medium  mb-2">
              ¿Cuánto dinero necesitas que te prestemos?
            </label>
            <input
              type="text"
              id="loanAmount"
              className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Min. </p>
          </div>

          <div className ="mb-6">
            <label htmlFor="loanTerm" className="block text-sm font-medium  mb-2">
              ¿En cuanto tiempo quieres pagarlo?
            </label>
            <div className="relative">
              <select
                id="loanTerm"
                className="w-full p-3 border bg-transparent rounded appearance-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10">10 meses</option>
                <option value="12">12 meses</option>
                <option value="18">18 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className ="mb-6">
            <p className="block text-sm font-medium  mb-2">
              ¿Como quieres pagar tus intereses?
            </p>
            <div className="flex space-x-4">
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-colors`}
                onClick={() => console.log('hola')}
              >
                <p className="font-medium mb-1">Método Francés</p>
                <p className="text-xs">Cuotas se mantienen fijas en el tiempo</p>
              </div>
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-colors`}
                onClick={() => console.log('hola')}
              >
                <p className="font-medium mb-1">Método Alemán</p>
                <p className="text-xs">Cuotas variables que decrecen en el tiempo</p>
              </div>
            </div>
          </div>

          <button
            className ="w-full py-3 bg-transparent/10 font-medium border rounded hover:bg-transparent/20 transition-colors"
          >
            Simular
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h2 className="text-lg font-medium text-center mb-6">Tus pagos mensuales serán</h2>

          <div className="flex justify-center items-center space-x-2 mb-8 text-black dark:text-white">
            <div className="text-center">
              <p className="text-lg font-semibold"> </p>
              <p className="text-xs">Capital</p>
            </div>
            <div className="text-2xl font-light text-gray-400">+</div>
            <div className="text-center">
              <p className="text-lg font-semibold"></p>
              <p className="text-xs">Interés</p>
            </div>
            <div className="text-2xl font-light text-gray-400">+</div>
            <div className="text-center">
              <p className="text-lg font-semibold"></p>
              <p className="text-xs">Seguro</p>
            </div>
          </div>

          <div className ="text-center mb-4">
            <p className="text-4xl font-bold "></p>
            <p className="text-sm mt-2">Durante <span className="font-medium"> meses</span></p>
            <p className="text-sm">Con una tasa de interés referencial <span className="font-medium">13%</span></p>
          </div>

          <div className="bg-transparent rounded-lg p-4 mb-4 border border-stroke">
            <h3 className="text-lg font-medium mb-4 text-center">Detalle de tu crédito</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Capital:</p>
                <p className="font-medium"></p>
              </div>
              <div className="flex justify-between">
                <p>Total de interés:</p>
                <p className="font-medium"> </p>
              </div>
              <div className="flex justify-between">
                <p>Total seguro de desgravamen:</p>
                <p className="font-medium"> </p>
              </div>
              <div className="border-t pt-2 mt-2  flex justify-between">
                <p className="font-medium">Total a pagar:</p>
                <p className="font-bold "></p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mb-6">
            *Valores referenciales, no son considerados como una oferta formal de préstamo. La oferta definitiva está sujeta al cumplimiento de las condiciones y políticas referentes a capacidad de pago.
          </p>

          <button className="text-blue-600 hover:text-blue-800 text-center"
          onClick={()=> openModal()}>
            Ver tabla de amortización
          </button>
          <AmortizationPopup
            title="Tabla de Amortización"
            isOpen={isModalOpen}
            onClose={closeModal}
          >
          </AmortizationPopup>

        </div>
      </div>

    </>
  );
};

export default CreditTypes;
