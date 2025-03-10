import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "./SIdebar";
import logo from "../assets/logo.webp";
import {
  X,
  Home,
  Info,
  Settings,
  Users,
  CircleDollarSign,
  Receipt,
  Link,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URI;
const navigation = [
  { name: "Dashboard", href: "/", icon: <Home /> },
  { name: "Ingresos", href: "/ingreso", icon: <CircleDollarSign /> },
  { name: "Gastos", href: "/gastos", icon: <Receipt /> },
  { name: "Configuracion", href: "/config", icon: <Settings /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const navegacion = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logOutUser, isLoading, user, authenticateUser } =
    useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
      if (!isLoggedIn && !isLoading) {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function redireccion(uri) {
    navegacion(uri);
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 w-full z-50 fixed sm:relative sm:mb-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Sidebar navigations={{ navigation, logo }} />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="h-8 w-auto rounded-xl"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    onClick={() => redireccion(item.href)}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <span></span>
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              {/* <BellIcon aria-hidden="true" className="size-6" /> */}
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full items-center bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <a className="link link-hover px-6 text-fuchsia-50 ">{user.name}</a>
                  {/* <span className="sr-only">Open user menu</span> */}
                  <img
                    alt=""
                    src={
                      user?.image ||
                      "https://cdn-icons-png.flaticon.com/512/12225/12225881.png"
                    }
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    id="profile"
                    onClick={() => navigate("/profile")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={() => navigate("/config")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Configuracion
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={() => logOutUser()}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Cerrar Sesion
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              onClick={() => redireccion(item.href)}
              key={item.name}
              as="a"
              href={item.href}
              aria-current={
                location.pathname === item.href ? "page" : undefined
              }
              className={classNames(
                location.pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
