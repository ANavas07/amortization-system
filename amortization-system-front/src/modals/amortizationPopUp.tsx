import { useRef, useEffect, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { tableAmortizationDataT } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useBank from '../hooks/useBank';
import { IMAGE_URL } from '../helpers/Constants';
import { useAuthContext } from '../context/AuthContext';

(window as any).jsPDF = jsPDF;
(window as any).autoTable = autoTable;

interface AmortizationPopupProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  loanData: tableAmortizationDataT[];
}


const AmortizationPopup = ({ title, isOpen, onClose, loanData }: AmortizationPopupProps) => {
  if (!isOpen) return null;
  const { authUser } = useAuthContext();
  const tableRef = useRef<any>(null);
  const { getBanks } = useBank();

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [bankName, setBankName] = useState<string>('Nombre del Banco');

  useEffect(() => {
    const localStorageData = localStorage.getItem('user-log');

    if (localStorageData) {
      const parsed = JSON.parse(localStorageData);
      if (parsed.logo) {
        setLogoUrl(`${IMAGE_URL}${parsed.logo}`);
      }
    }

    // Cargar nombre del banco desde la API
    const fetchBankName = async () => {
      try {
        const res = await getBanks();
        const bank = res.msg?.[0];
        if (bank?.name) {
          setBankName(bank.name);
        }
      } catch (err) {
        console.error('Error cargando nombre del banco:', err);
        setBankName('Nombre del Banco');
      }
    };

    fetchBankName();
  }, []);

  const columns = [
    { title: 'Cuotas', field: 'id' },
    { title: 'Fecha de pago', field: 'paymentDate' },
    { title: 'Capital', field: 'capital' },
    { title: 'Interés', field: 'interest' },
    { title: 'Seguro desg.', field: 'lifeInsurance' },
    { title: 'Seguro Incendios/Vehículo', field: 'insurance' },
    { title: 'Valor de la cuota', field: 'fee' },
    { title: 'Saldo', field: 'balance' },
  ];

  const downloadPdf = async () => {
    const doc = new jsPDF();

    // Logo
    if (logoUrl) {
      try {
        const img = await loadImage(logoUrl);
        doc.addImage(img, 'PNG', 10, 10, 30, 30);
      } catch (err) {
        console.warn('No se pudo cargar el logo del banco:', err);
      }
    }

    // Nombre del banco
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185); // azul oscuro
    
    if (authUser?.fullName) {
      // Banco a la izquierda, Usuario a la derecha
      doc.text(bankName || 'Nombre del Banco', 10, 20, { align: 'left' });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // texto negro para el usuario
      doc.text(`Usuario: ${authUser.fullName}`, 200, 20, { align: 'right' });
    } else {
      // Solo banco centrado
      doc.text(bankName || 'Nombre del Banco', 105, 20, { align: 'center' });
    }
    
    
    // Tabla
    autoTable(doc, {
      startY: 45,
      head: [[
        'Cuotas', 'Fecha de pago', 'Capital', 'Interés',
        'Seguro desg.', 'Seguro Inc/Vehículo', 'Valor cuota', 'Saldo',
      ]],
      body: loanData.map(item => [
        item.id,
        item.paymentDate,
        item.capital,
        item.interest,
        item.lifeInsurance,
        item.insurance,
        item.fee,
        item.balance,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save('tabla_amortizacion.pdf');
  };
  console.log("Intentando cargar logo desde:", logoUrl);

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error("Falló carga de logo", e);
        reject(new Error('Logo no cargado'));
      };
      img.src = url;
    });
  };
  

  return (
    <dialog open className="modal modal-middle z-[10000]">
      <div className="modal-box w-4/5 h-4/5 max-w-none p-6 overflow-auto rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <h3 className="font-bold text-lg text-black dark:text-white mb-4">
          {title}
        </h3>

        <div>
          <ReactTabulator
            onRef={ref => (tableRef.current = ref)}
            data={loanData}
            columns={columns}
            layout="fitColumns"
            options={{
              movableColumns: true,
              resizableRows: true,
            }}
          />
        </div>

        <div className="modal-action mt-4">
          <button
            className="btn bg-primary text-white hover:bg-primary-dark"
            onClick={downloadPdf}
          >
            Descargar PDF
          </button>
          <button
            className="btn bg-gray-500 text-white hover:bg-gray-700"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AmortizationPopup;
