import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import { CiLogout } from "react-icons/ci";
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../context/AuthContext';
import { IoSettingsOutline, IoBusinessSharp } from "react-icons/io5";
import { FaSignInAlt } from "react-icons/fa";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { loading, logout } = useLogout();
  const { authUser } = useAuthContext();

  // Si no hay usuario autenticado, mostrar botón de inicio de sesión
  if (!authUser) {
    return (
      <Link
        to="/auth/signin"
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all"
      >
        <FaSignInAlt />
        <span className="hidden md:inline">Iniciar Sesión</span>
      </Link>
    );
  }

  // Si hay usuario autenticado, mostrar el dropdown
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {authUser.fullName}
          </span>
          <span className="block text-xs">
            {authUser.dni}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <IoSettingsOutline />
                Ajustes Cooperativa
              </Link>
            </li>
            {authUser.role !== 'B' && (
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <IoBusinessSharp />
                  Mi perfil
                </Link>
              </li>
            )}
          </ul>
          {!loading ? (
            <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              onClick={logout}>
              <CiLogout className='w-[22px] h-[22px]' />
              Log Out
            </button>
          ) : (
            <span className="loading loading-spinner"></span>
          )}
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
