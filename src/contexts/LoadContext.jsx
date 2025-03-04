import { createContext, useState } from "react";

const CargaContext = createContext();

function CargaProvider(props) {
  const [carga, setCarga] = useState(true);

  return (
    <CargaContext.Provider value={{ carga, setCarga }}>
      {props.children}
    </CargaContext.Provider>
  );
}
export { CargaContext, CargaProvider };
