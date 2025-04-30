import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AmortizationPopup from '../../modals/amortizationPopUp';
import { amortizationT, tableAmortizationDataT } from '../../types';

const CreditTypes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opCreditType, setOpCreditType] = useState('');
  const [amortizationSystem, setAmortizationSystem] = useState<'frances' | 'aleman' | null>(null);
  const [dataLoan, setDataLoan] = useState<tableAmortizationDataT[]>([]); 

  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;
  }, [authUser]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreditTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOpCreditType(event.target.value);
    console.log(event.target.value);
  }

  const creditTypes: string[] = [
    'Consumo (Personal)',
    'Vehicular',
    'Hipotecario (Vivienda)',
    'Microcrédito',
    'Quirografario'
  ];

  const timeOptions: Record<number, string> = {
    1: 1 * 12 + ' meses',
    2: 2 * 12 + ' meses',
    3: 3 * 12 + ' meses',
    4: 4 * 12 + ' meses',
    5: 5 * 12 + ' meses',
    6: 6 * 12 + ' meses',
    7: 7 * 12 + ' meses',
    8: 8 * 12 + ' meses',
    9: 9 * 12 + ' meses',
    10: 10 * 12 + ' meses',
    11: 11 * 12 + ' meses',
    12: 12 * 12 + ' meses',
    13: 13 * 12 + ' meses',
    14: 14 * 12 + ' meses',
    15: 15 * 12 + ' meses',
    16: 16 * 12 + ' meses',
    17: 17 * 12 + ' meses',
    18: 18 * 12 + ' meses',
    19: 19 * 12 + ' meses',
    20: 20 * 12 + ' meses',
  }

  //Logica para obtener la tasa de amortizacion
  const getAmortizationFrenchRate = (amortizationData: amortizationT) => {
    const { loanAmount, paymentTime, interestRate } = amortizationData;
    const i = interestRate / 12;
    const fee = loanAmount * (i / (1 - Math.pow(1 + i, -paymentTime)));
    const tablaAmortizationSystem: tableAmortizationDataT[] = [];

    let balance = loanAmount;

    for (let k = 1; k <= paymentTime; k++) {
      const interest = balance * i;
      const capital = fee - interest;
      const newBalance = Math.max(0, balance - capital);
      const lifeInsurance = 0.01 * balance;
      const startDate = new Date();
      tablaAmortizationSystem.push({
        id: k,
        paymentDate: new Date(
          startDate.getFullYear(),
          startDate.getMonth() + k,
          startDate.getDate()
        ).toLocaleDateString(),
        capital: Number(capital.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        fee: Number(fee.toFixed(2)),
        lifeInsurance: Number(lifeInsurance.toFixed(2)),
        insurance: 0,
        balance: Number(newBalance.toFixed(2)),
      });
      balance = newBalance;
    }
    setDataLoan(tablaAmortizationSystem);
    return true;
  }

  const getAmortizationGermanyRate = (amortizationData: amortizationT) => {
    const { loanAmount, paymentTime, interestRate } = amortizationData;
    const i = interestRate / 12;
    const capital = loanAmount / paymentTime;
    const tablaAmortizationSystem: tableAmortizationDataT[] = [];

    let balance = loanAmount;

    for (let k = 1; k <= paymentTime; k++) {
      const interest = balance * i;
      const fee = capital + interest;
      const newBalance = Math.max(0, balance - capital);
      const lifeInsurance = 0.01 * balance;
      const startDate = new Date();
      tablaAmortizationSystem.push({
        id: k,
        paymentDate: new Date(
          startDate.getFullYear(),
          startDate.getMonth() + k,
          startDate.getDate()
        ).toLocaleDateString(),
        capital: Number(capital.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        fee: Number(fee.toFixed(2)),
        lifeInsurance: Number(lifeInsurance.toFixed(2)),
        insurance: 0,
        balance: Number(newBalance.toFixed(2)),
      });
      balance = newBalance;
    }
    setDataLoan(tablaAmortizationSystem);
    return true;
  }

  const amortizationSystemHandler = (amortizationData: amortizationT) => {
    if (amortizationSystem === 'frances') {
      return getAmortizationFrenchRate(amortizationData);
    } else if (amortizationSystem === 'aleman') {
      return getAmortizationGermanyRate(amortizationData);
    } else {
      console.error('Invalid amortization system selected');
      return false;
    }
  }

  const dataExample: amortizationT = {
    method: amortizationSystem || '',
    loanAmount: 10000,
    priceGoods: 0,
    paymentTime: 12,
    interestRate: 0.13,
  }

  return (
    <>
      <Breadcrumb pageName="¿Que tipo de credito necesitas?" />
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-center md:items-center lg:gap-12 mt-4 text-black dark:text-white">
        <select defaultValue="Pick a color" className="select  rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none
      dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          onChange={handleCreditTypeChange}>
          <option disabled>¿Que tipo de credito necesitas?</option>
          {
            creditTypes.map((type, index) => {
              return (
                <option key={index} value={type}>
                  {type}
                </option>
              )
            })
          }
        </select>
      </div>

      <div className="flex flex-col md:flex-row border-stroke bg-transparent rounded-lg shadow-md max-w-6xl mx-auto mt-8">
        {/* Left Column - Input Form */}
        <div className="w-full md:w-1/2 p-6 border-stroke bg-transparent rounded-l-lg text-black dark:text-white">

          {opCreditType.includes('Hipotecario (Vivienda)') && (
            <div className="mb-6">
              <label htmlFor="loanAmount" className="block text-sm font-medium  mb-2">
                ¿Cual es el costo de la vivienda?
              </label>
              <input
                type="text"
                id="loanAmount"
                className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Min. </p>
            </div>
          )}

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

          <div className="mb-6 text-black dark:text-white">
            <label htmlFor="loanTerm" className="block text-sm font-medium  mb-2">
              ¿En cuanto tiempo quieres pagarlo?
            </label>
            <div className="relative">

              <select defaultValue="Selecciona el tiempo" className="select w-full rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none
      dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-white">
                {
                  Object.entries(timeOptions).map(([Key, value]) => (
                    <option key={Key} value={Key}>{value}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium  mb-2">
              ¿Como quieres pagar tus intereses?
            </p>
            <div className="flex space-x-4">
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-shadow duration-200
                  ${amortizationSystem === 'frances' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}`}
                onClick={() => setAmortizationSystem('frances')}
              >
                <p className="font-medium mb-1">Método Francés</p>
                <p className="text-xs">Cuotas se mantienen fijas en el tiempo</p>
              </div>
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-shadow duration-200
                  ${amortizationSystem === 'aleman' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}`}
                onClick={() => setAmortizationSystem('aleman')}
              >
                <p className="font-medium mb-1">Método Alemán</p>
                <p className="text-xs">Cuotas variables que decrecen en el tiempo</p>
              </div>
            </div>
          </div>

          <button
            className="w-full py-3 bg-transparent/10 font-medium border rounded hover:bg-transparent/20 transition-colors"
            onClick={() => amortizationSystemHandler(dataExample)}
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

          <div className="text-center mb-4">
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

          <button className="text-blue-600 hover:text-blue-800 text-center mb-100"
            onClick={() => openModal()}>
            Ver tabla de amortización
          </button>
            <AmortizationPopup
            title={`Tabla de amortización ${amortizationSystem}`}
            isOpen={isModalOpen}
            onClose={closeModal}
            loanData={dataLoan}
            >
            </AmortizationPopup>

        </div>
      </div >

    </>
  );
};

export default CreditTypes;
