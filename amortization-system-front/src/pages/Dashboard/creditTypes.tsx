import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { FaBusAlt } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { FaPeopleGroup } from "react-icons/fa6";
import useDashboard from '../../hooks/useDashboard';
import { useAuthContext } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TbSquareRoundedChevronsLeftFilled } from 'react-icons/tb';

const CreditTypes: React.FC = () => {

  const { cardsDataDashboard } = useDashboard();
  const [activeFreq, setActiveFreq] = useState<number>(0);
  const [quantityPayments, setQuantityPayments] = useState<number>(0);
  const [sales, setSales] = useState<number>(0);
  const [quantityClients, setQuantityClients] = useState<number>(0);
  const { authUser } = useAuthContext();


  useEffect(() => {

    if (!authUser) return;

    const fetchData = async () => {
      try {
        const data = await cardsDataDashboard();
        if (data) {
          const { dataActiveFreq, dataQuantityPayments, dataSales, dataQuantityClients } = data;
          setActiveFreq(dataActiveFreq);
          setQuantityPayments(dataQuantityPayments);
          setSales(dataSales);
          setQuantityClients(dataQuantityClients);
        }
      } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
      }
    };

    fetchData();
  }, [authUser]);


  return (
    <>
      <Breadcrumb pageName="Tipos de credito" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Línea abierta" subtitle={activeFreq.toString()} rate="0.43%" levelUp>
          <FaBusAlt className='w-[22px] h-[22px]' />
        </CardDataStats>
        <CardDataStats title="Hipotecario de vivienda" subtitle={quantityPayments.toString()} rate="4.35%" levelUp>
          <MdOutlinePayments className='w-[22px] h-[22px]' />
        </CardDataStats>
        <CardDataStats title="Vivienda de interés publico" subtitle={`$${sales.toString()}`} rate="2.59%" levelUp>
          <FcSalesPerformance className='w-[22px] h-[22px]' />
        </CardDataStats>
        <CardDataStats title="Vivienda de interés social" subtitle={quantityClients.toString()} rate="0.95%" levelDown>
          <FaPeopleGroup className='w-[22px] h-[22px]' />
        </CardDataStats>
        <CardDataStats title="Educación superior" subtitle={quantityClients.toString()} rate="0.95%" levelDown>
          <FaPeopleGroup className='w-[22px] h-[22px]' />
        </CardDataStats>
      </div>
    </>
  );
};

export default CreditTypes;
