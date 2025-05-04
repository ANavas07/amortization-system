import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AmortizationPopup from '../../modals/amortizationPopUp';
import { amortizationT, investmentResultT, loanSettingsT, tableAmortizationDataT } from '../../types';
import useLoanSettings from '../../hooks/useLoanSettings';
import toast from 'react-hot-toast';
import rates from '../../utils/investmentsRates.json';

const Investments: React.FC = () => {

  const [opCreditType, setOpCreditType] = useState('');
  const [investmentRateTime, setInvestmentRateTime] = useState<'month' | 'days' | null>(null);
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

  const [investmentFinalData, setInvestmentFinalData] = useState<investmentResultT | null>(null);
  const [error, setError] = useState<string>('');
  const [errorG, setErrorG] = useState<string>('');
  const { authUser } = useAuthContext();


  useEffect(() => {
    if (!authUser) return;

    const loadSettings = async () => {
      const loanSettingsData = await getLoanSettings();
      setSelectedLoanSettings(loanSettingsData.data);
    }

    loadSettings();
  }, [authUser]);

  const [investAmount, setInvestAmount] = useState<number>(0);
  const [time, setTime] = useState<number>(0);


  const [priceGoods, setPriceGoods] = useState<number>(0);
  const [paymentTime, setPaymentTime] = useState<number>(12); // valor por defecto
  const [paymentTimeText, setPaymentTimeText] = useState<string>('');
  const [totalCapital, setTotalCapital] = useState<number>(0);
  const [totalInteres, setTotalInteres] = useState<number>(0);
  const [totalSeguro, setTotalSeguro] = useState<number>(0);
  const [totalPagar, setTotalPagar] = useState<number>(0);
  const [primeraCuota, setPrimeraCuota] = useState<tableAmortizationDataT | null>(null);


  const getInvestmentSimulation = (invest: number, capitalization: boolean = false) => {
    const days = investmentRateTime === 'month' ? (time * 30) + 1 : time;

    const termRange = Object.keys(rates).find(range => {
      const [min, max] = range.includes('+') ? [361, 999] : range.split('-').map(Number);
      return days >= min && days <= max;
    });

    const termRates = rates[termRange as keyof typeof rates];

    const amountRange = Object.keys(termRates).find(range => {
      if (range.includes('+')) return invest >= parseFloat(range);
      const [min, max] = range.split('-').map(Number);
      return invest >= min && invest <= max;
    });

    if (!amountRange || !(amountRange in termRates)) {
      console.error("No se encontró un rango de monto válido para la inversión:", invest);
      return null;
    }

    const anualRate = termRates[amountRange as keyof typeof termRates] / 100;
    const yearTime = days / 360;

    const finalAmount = capitalization
      ? invest * Math.pow((1 + anualRate), yearTime)
      : invest * (1 + anualRate * yearTime);

    const finalData: investmentResultT = {
      initialAmount: invest,
      days: days,
      yearlyRate: (anualRate * 100).toFixed(2) + '%',
      finalAmount: finalAmount.toFixed(2),
      earnedInterest: (finalAmount - invest).toFixed(2),
    }

    return finalData;
  };


  const startSimulation = () => {
    if (error || errorG) {
      toast.error('Por favor, corrige los errores antes de continuar.');
      return;
    }

    if (investmentRateTime !== null) {
      const result = getInvestmentSimulation(investAmount);
      console.log(result);
      setInvestmentFinalData(result);
    } else {
      toast.error('Por favor, selecciona un sistema de amortización válido.');
      return;
    }

  }


  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInvestAmount(value);
    const min = 500;
    const max = 1000000;
    if (value < min) {
      setError(`El monto mínimo es ${min}`);
    } else if (value > max) {
      setError(`El monto máximo es ${max}`);
    } else {
      setError('');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTime(value);
    if (investmentRateTime === 'month') {
      if (value < 1 || value > 12) {
        setErrorG(`El tiempo mínimo es 1 mes y el máximo 12 meses`);
      } else {
        setErrorG('');
      }
    } else if (investmentRateTime === 'days') {
      if (value < 31 || value > 365) {
        setErrorG(`El tiempo mínimo es 31 días y el máximo 365 días`);
      } else {
        setErrorG('');
      }
    } else {
      setErrorG('');
    }
  };


  return (
    <>
      <Breadcrumb pageName="Simulador de inversiones" />

      <div className="flex flex-col md:flex-row border-stroke bg-transparent rounded-lg shadow-md max-w-6xl mx-auto mt-8">
        <div className="w-full md:w-1/2 p-6 border-stroke bg-transparent rounded-l-lg text-black dark:text-white">
          <div className="mb-6">
            <label htmlFor="investAmount" className="block text-sm font-medium  mb-2">
              Monto inversion
            </label>
            <input
              type="number"
              id="investAmount"
              className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInvestmentChange}
            />
            <p className="text-xs text-gray-500 mt-1">Min. 500</p>
            <p className="text-xs text-gray-500 mt-1">Max. 1000000</p>
            {error && (
              <p className="text-red-500 text-sm mt-1">
                ⚠ {error}
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium  mb-2">
              ¿Tiempo de inversión?
            </p>
            <div className="flex space-x-4">
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-shadow duration-200
                  ${investmentRateTime === 'month' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}`}
                onClick={() => setInvestmentRateTime('month')}
              >
                <p className="font-medium mb-1">Meses</p>
                <p className="text-xs">1-12</p>
              </div>
              <div
                className={`flex-1 p-4 border rounded cursor-pointer transition-shadow duration-200
                  ${investmentRateTime === 'days' ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-none'}`}
                onClick={() => setInvestmentRateTime('days')}
              >
                <p className="font-medium mb-1">Días</p>
                <p className="text-xs">31 - 361+</p>
              </div>
            </div>
          </div>

          {investmentRateTime != null && (
            <div className="mb-6">
              <label htmlFor="investAmount" className="block text-sm font-medium  mb-2">
                {investmentRateTime === 'month' ? 'Meses' : 'Días'}
              </label>
              <input
                type="number"
                id="investAmount"
                className="w-full p-3 border bg-transparent rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={handleTimeChange}
              />
              {errorG && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠ {errorG}
                </p>
              )}
            </div>
          )}


          <button
            className="w-full py-3 bg-transparent/10 font-medium border rounded hover:bg-transparent/20 transition-colors"
            onClick={() =>
              startSimulation()
            }
          >
            Simular
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">

          <div className="text-center mb-4">
            <p className="text-4xl font-bold "></p>
            <p className="text-sm mt-2">Durante <span className="font-medium">{ investmentFinalData?.days} días</span></p>
            <p className="text-sm">Con una tasa de interés <span className="font-medium">{ investmentFinalData?.yearlyRate}</span></p>
          </div>

          <div className="bg-transparent rounded-lg p-4 mb-4 border border-stroke">
            <h3 className="text-lg font-medium mb-4 text-center">Detalle de tu crédito</h3>

            <div className="flex justify-between">
              <p>Inversión Inicial:</p>
              <p className="font-medium">{investAmount.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className="flex justify-between">
              <p>Total de interés:</p>
              <p className="font-medium">
                {
                  isFinite(Number(investmentFinalData?.earnedInterest))
                    ? Number(investmentFinalData?.earnedInterest).toLocaleString('es-EC', {
                      style: 'currency',
                      currency: 'USD'
                    })
                    : '$0.00'
                }
              </p>
            </div>
            <div className="border-t pt-2 mt-2  flex justify-between">
              <p className="font-medium">Total:</p>
              <p className="font-bold">  {
                isFinite(Number(investmentFinalData?.finalAmount))
                  ? Number(investmentFinalData?.finalAmount).toLocaleString('es-EC', {
                    style: 'currency',
                    currency: 'USD'
                  })
                  : '$0.00'
              }</p>
            </div>

          </div>
        </div>
      </div >

    </>
  );
};

export default Investments;
