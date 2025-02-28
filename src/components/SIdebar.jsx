import { useState } from "react";
import { Menu, X, Home, Info, Settings, WrapText } from "lucide-react";

export default function Sidebar({ navigations }) {
  const [isOpen, setIsOpen] = useState(false);
  const { navigation, logo } = navigations;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="flex ">
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-2 bg-gray-800 text-white rounded-md focus:outline-none"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-5 transition-transform z-2 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-5" onClick={() => setIsOpen(false)}>
          <X />
        </h2>
        <img className="rounded-full" src={logo} alt="logo" />
        <ul>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded cursor-pointer"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
}
