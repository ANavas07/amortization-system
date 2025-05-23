import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AmortizationPopup from '../../modals/amortizationPopUp';
import { amortizationT, loanSettingsT, tableAmortizationDataT } from '../../types';
import useLoanSettings from '../../hooks/useLoanSettings';
import toast from 'react-hot-toast';

const CreditTypes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opCreditType, setOpCreditType] = useState('');
  const [amortizationSystem, setAmortizationSystem] = useState<'frances' | 'aleman' | null>(null);
  const [dataLoan, setDataLoan] = useState<tableAmortizationDataT[]>([]);
  //Para manejo del interes
  const [selectedLoanSettings, setSelectedLoanSettings] = useState<Record<string, any>>({});
  const { getLoanSettings } = useLoanSettings();
  const [loanControlSettings, setLoanControlSettings] = useState<loanSettingsT>({
    interest: 0,
    minAmount: 0,
    maxAmount: 0,
    insurance: 0,
    maxCostGoods: 0,
    minCostGoods: 0,
  });
  const [error, setError] = useState<string>('');
  const [errorG, setErrorG] = useState<string>('');
  // Estado para controlar si se ha seleccionado un tipo de crédito válido
  const [isCreditTypeSelected, setIsCreditTypeSelected] = useState(false);


  useEffect(() => {

    const loadSettings = async () => {
      const loanSettingsData = await getLoanSettings();
      setSelectedLoanSettings(loanSettingsData.data);
    }

    loadSettings();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreditTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setOpCreditType(selectedValue);

    if (selectedValue && selectedValue !== "¿Que tipo de credito necesitas?") {
      setIsCreditTypeSelected(true);
    } else {
      setIsCreditTypeSelected(false);
    }

    selectedLoanSettings[selectedValue] && setLoanControlSettings(selectedLoanSettings[selectedValue]);
    handleCleanInput();
  };

  const handleCleanInput = () => {
    setAmortizationSystem(null);
    setLoanAmount(0);
    setPaymentTimeText('');
    setPaymentTime(12);
    setTotalCapital(0);
    setTotalInteres(0);
    setTotalSeguro(0);
    setTotalPagar(0);
    setPrimeraCuota(null);
  }

  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [priceGoods, setPriceGoods] = useState<number>(0);
  const [paymentTime, setPaymentTime] = useState<number>(12); // valor por defecto
  const [paymentTimeText, setPaymentTimeText] = useState<string>('');
  const [totalCapital, setTotalCapital] = useState<number>(0);
  const [totalInteres, setTotalInteres] = useState<number>(0);
  const [totalSeguro, setTotalSeguro] = useState<number>(0);
  const [totalPagar, setTotalPagar] = useState<number>(0);
  const [primeraCuota, setPrimeraCuota] = useState<tableAmortizationDataT | null>(null);

  const creditTypes: Object = {
    'consumo': 'Consumo (Personal)',
    'vehicular': 'Vehicular',
    'hipotecario': 'Hipotecario (Vivienda)',
    'microcredito': 'Microcrédito',
    'quirografario': 'Quirografario'
  };

  const timeOptions: Record<number, string> = {
    12: '1 año (12 meses)',
    24: '2 años (24 meses)',
    36: '3 años (36 meses)',
    48: '4 años (48 meses)',
    60: '5 años (60 meses)',
    72: '6 años (72 meses)',
    84: '7 años (84 meses)',
    96: '8 años (96 meses)',
    108: '9 años (108 meses)',
    120: '10 años (120 meses)',
    132: '11 años (132 meses)',
    144: '12 años (144 meses)',
    156: '13 años (156 meses)',
    168: '14 años (168 meses)',
    180: '15 años (180 meses)',
    192: '16 años (192 meses)',
    204: '17 años (204 meses)',
    216: '18 años (216 meses)',
    228: '19 años (228 meses)',
    240: '20 años (240 meses)',
  };


  //Logica para obtener la tasa de amortizacion
  const getAmortizationFrenchRate = (amortizationData: amortizationT) => {
    const { loanAmount, paymentTime, interestRate } = amortizationData;
    const i = interestRate / 12;
    const fee = loanAmount * (i / (1 - Math.pow(1 + i, -paymentTime)));
    const tablaAmortizationSystem: tableAmortizationDataT[] = [];

    let balance = loanAmount;
    let sumCapital = 0;
    let sumInterest = 0;
    let sumSeguro = 0;

    for (let k = 1; k <= paymentTime; k++) {

      const interest = balance * i;
      const capital = fee - interest;
      const newBalance = Math.max(0, balance - capital);
      const lifeInsurance = 0.01 * balance;
      const startDate = new Date();
      sumCapital += capital;
      sumInterest += interest;
      sumSeguro += lifeInsurance;
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
      setTotalCapital(Number(sumCapital.toFixed(2)));
      setTotalInteres(Number(sumInterest.toFixed(2)));
      setTotalSeguro(Number(sumSeguro.toFixed(2)));
      setTotalPagar(Number((sumCapital + sumInterest + sumSeguro).toFixed(2)));
    }
    setPrimeraCuota(tablaAmortizationSystem[0]);

    setDataLoan(tablaAmortizationSystem);
    return true;
  };

  const getAmortizationGermanyRate = (amortizationData: amortizationT) => {
    const { loanAmount, paymentTime, interestRate } = amortizationData;
    const i = interestRate / 12;
    const capital = loanAmount / paymentTime;
    const tablaAmortizationSystem: tableAmortizationDataT[] = [];

    let balance = loanAmount;
    let sumCapital = 0;
    let sumInterest = 0;
    let sumSeguro = 0;
    for (let k = 1; k <= paymentTime; k++) {
      const interest = balance * i;
      const fee = capital + interest;
      const newBalance = Math.max(0, balance - capital);
      const lifeInsurance = 0.01 * balance;
      const startDate = new Date();
      sumCapital += capital;
      sumInterest += interest;
      sumSeguro += lifeInsurance;
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
      setTotalCapital(Number(sumCapital.toFixed(2)));
      setTotalInteres(Number(sumInterest.toFixed(2)));
      setTotalSeguro(Number(sumSeguro.toFixed(2)));
      setTotalPagar(Number((sumCapital + sumInterest + sumSeguro).toFixed(2)));
    }
    setPrimeraCuota(tablaAmortizationSystem[0]);


    setDataLoan(tablaAmortizationSystem);
    return true;
  };

  const amortizationSystemHandler = (amortizationData: amortizationT) => {
    if(!inpControls(amortizationData)){
      return;
    };

    if (amortizationSystem === 'frances') {
      return getAmortizationFrenchRate(amortizationData);
    } else if (amortizationSystem === 'aleman') {
      return getAmortizationGermanyRate(amortizationData);
    } else {
      toast.error('Por favor, selecciona un sistema de amortización válido.');
      return false;
    }
  };

  const inpControls = (amortizationData: amortizationT) => {

    if(!amortizationData.loanAmount || !amortizationData.paymentTime) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return false;
    }

    if (error || errorG) {
      toast.error('Por favor, corrige los errores antes de continuar.');
      return false;
    }

    const calculatedPrice = (amortizationData.priceGoods || 0) * 0.8;
    if (opCreditType.includes('hipotecario')) {
      if (loanAmount > calculatedPrice) {
        toast.error('El monto máximo a prestar es el 80% del costo de la vivienda.');
        return false;
      } else {
        return true;
      }
    };

    return true;

  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueString = e.target.value;
    const isValidInput = /^[\d]*\.?[\d]{0,2}$/.test(valueString);
    if (!isValidInput) return;
    const value = parseFloat(valueString);

    setLoanAmount(value);
    if (value < Number(loanControlSettings.minAmount)) {
      setError(`El monto mínimo es ${loanControlSettings.minAmount}`);
    } else if (value > Number(loanControlSettings.maxAmount)) {
      setError(`El monto máximo es ${loanControlSettings.maxAmount}`);
    } else {
      setError('');
    }
  };

  const handleCostGoodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueString = e.target.value;
    const isValidInput = /^[\d]*\.?[\d]{0,2}$/.test(valueString); // permite números con hasta 2 decimales
    if (!isValidInput) return;
    const value = Number(valueString);

    setLoanAmount(value);
    if (value < Number(loanControlSettings.minCostGoods)) {
      setErrorG(`El monto mínimo es ${loanControlSettings.minCostGoods}`);
    } else if (value > Number(loanControlSettings.maxCostGoods)) {
      setErrorG(`El monto máximo es ${loanControlSettings.maxCostGoods}`);
    } else {
      setErrorG('');
    }
  };


  return (
    <>
      <Breadcrumb pageName="¿Que tipo de credito necesitas?" />
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-center md:items-center lg:gap-12 mt-4 text-black dark:text-white">
        <select defaultValue="¿Que tipo de credito necesitas?" className="select  rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none
      dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          onChange={handleCreditTypeChange}>
          <option disabled>¿Que tipo de credito necesitas?</option>
          {
            Object.entries(creditTypes)?.map(([key, value]: any) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))
          }
        </select>
      </div>

      <div className="flex flex-col md:flex-row border-stroke bg-transparent rounded-lg shadow-md max-w-6xl mx-auto mt-8 dark:bg-boxdark">
        {/* Left Column - Input Form */}
        <div className="w-full md:w-1/2 p-6 border-stroke bg-transparent rounded-l-lg text-black dark:text-white">

          {opCreditType.includes('hipotecario') && (
            <div className="mb-6">
              <label htmlFor="priceGoods" className="block text-sm font-medium  mb-2">
                ¿Cual es el costo de la vivienda?
              </label>
              <input
                type="text"
                id="priceGoods"
                className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={handleCostGoodsChange}
                disabled={!isCreditTypeSelected}
                value={priceGoods.toString()}
              />
              <p className="text-xs text-gray-500 mt-1">Min. {loanControlSettings.minCostGoods}</p>
              <p className="text-xs text-gray-500 mt-1">Max. {loanControlSettings.maxCostGoods}</p>
              {errorG && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠ {errorG}
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="loanAmount" className="block text-sm font-medium  mb-2">
              ¿Cuánto dinero necesitas que te prestemos?
            </label>
            <input
              value={loanAmount.toString()}
              type="number"
              id="loanAmount"
              className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
              onChange={handleLoanAmountChange}
              disabled={!isCreditTypeSelected}
            />
            <p className="text-xs text-gray-500 mt-1">Min. {loanControlSettings.minAmount}</p>
            <p className="text-xs text-gray-500 mt-1">Max. {loanControlSettings.maxAmount}</p>
            {error && (
              <p className="text-red-500 text-sm mt-1">
                ⚠ {error}
              </p>
            )}
          </div>

          <div className="mb-6 text-black dark:text-white">
            <label htmlFor="loanTerm" className="block text-sm font-medium  mb-2">
              ¿En cuanto tiempo quieres pagarlo?
            </label>
            <div className="relative">

              <select
                value={paymentTime}
                // defaultValue="Selecciona el tiempo"
                onChange={(e) => {
                  setPaymentTime(Number(e.target.value));
                  setPaymentTimeText(e.target.options[e.target.selectedIndex].text);
                }}
                className="select w-full rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none
                  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-white"
                disabled={!isCreditTypeSelected}
              >
                <option value="" disabled>Selecciona el tiempo</option>
                {
                  Object.entries(timeOptions).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
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
                  ${amortizationSystem === 'frances' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}
                  ${!isCreditTypeSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => isCreditTypeSelected && setAmortizationSystem('frances')}
              >
                <p className="font-medium mb-1">Método Francés</p>
                <p className="text-xs">Cuotas se mantienen fijas en el tiempo</p>
              </div>
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-shadow duration-200
                  ${amortizationSystem === 'aleman' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}
                  ${!isCreditTypeSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => isCreditTypeSelected && setAmortizationSystem('aleman')}
              >
                <p className="font-medium mb-1">Método Alemán</p>
                <p className="text-xs">Cuotas variables que decrecen en el tiempo</p>
              </div>
            </div>
          </div>

          <button
            className={`w-full py-3 bg-transparent/10 font-medium border rounded hover:bg-transparent/20 transition-colors
              ${!isCreditTypeSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() =>
              isCreditTypeSelected && amortizationSystemHandler({
                method: amortizationSystem || '',
                loanAmount,
                priceGoods,
                paymentTime,
                interestRate: Number(loanControlSettings.interest) // o podrías hacerlo variable también
              })
            }
            disabled={!isCreditTypeSelected}
          >
            Simular
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h2 className="text-lg font-medium text-center mb-6">Tus pagos mensuales serán</h2>

          <div className="flex justify-center items-center space-x-2 mb-8 text-black dark:text-white">
            <div className="text-center">
              <p className="text-lg font-semibold">
                {primeraCuota ? primeraCuota.capital.toLocaleString('es-EC', { style: 'currency', currency: 'USD' }) : '—'}
              </p>
              <p className="text-xs">Capital</p>
            </div>
            <div className="text-2xl font-light text-gray-400">+</div>
            <div className="text-center">
              <p className="text-lg font-semibold">
                {primeraCuota ? primeraCuota.interest.toLocaleString('es-EC', { style: 'currency', currency: 'USD' }) : '—'}
              </p>
              <p className="text-xs">Interés</p>
            </div>
            <div className="text-2xl font-light text-gray-400">+</div>
            <div className="text-center">
              <p className="text-lg font-semibold">
                {primeraCuota ? primeraCuota.lifeInsurance.toLocaleString('es-EC', { style: 'currency', currency: 'USD' }) : '—'}
              </p>
              <p className="text-xs">Seguro</p>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-4xl font-bold "></p>
            <p className="text-sm mt-2">Durante <span className="font-medium">{paymentTimeText}</span></p>
            <p className="text-sm">Con una tasa de interés referencial <span className="font-medium">{(Number(loanControlSettings.interest) * 100).toFixed(2)}%</span></p>
          </div>

          <div className="bg-transparent rounded-lg p-4 mb-4 border border-stroke">
            <h3 className="text-lg font-medium mb-4 text-center">Detalle de tu crédito</h3>

            <div className="flex justify-between">
              <p>Capital:</p>
              <p className="font-medium">{totalCapital.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="flex justify-between">
              <p>Total de interés:</p>
              <p className="font-medium">{totalInteres.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="flex justify-between">
              <p>Total seguro de desgravamen:</p>
              <p className="font-medium">{totalSeguro.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="border-t pt-2 mt-2  flex justify-between">
              <p className="font-medium">Total a pagar:</p>
              <p className="font-bold">{totalPagar.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })}</p>
            </div>

          </div>

          <p className="text-xs text-gray-500 text-center mb-6">
            *Valores referenciales, no son considerados como una oferta formal de préstamo. La oferta definitiva está sujeta al cumplimiento de las condiciones y políticas referentes a capacidad de pago.
          </p>

          <button
            className={`text-blue-600 hover:text-blue-800 text-center mb-100 ${!isCreditTypeSelected || dataLoan.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => isCreditTypeSelected && dataLoan.length > 0 && openModal()}
            disabled={!isCreditTypeSelected || dataLoan.length === 0}
          >
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
