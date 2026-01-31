
"use client";

import { EDeviceView } from "@/types/enums";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface IViewContext {
     deviceType: EDeviceView,
     setDeviceType: (value: EDeviceView) => void
}

const ViewContext = createContext<IViewContext | undefined>(undefined);

export function ViewProvider ({children}:{children: ReactNode}) {
     const [deviceType,setDeviceType] = useState<EDeviceView>(EDeviceView.DESKTOP);

     useEffect(() => {
          const checkDevice = () => {
          const width = window.innerWidth;
          if (width < 768) setDeviceType(EDeviceView.MOBILE)
          else if (width < 1024) setDeviceType(EDeviceView.TABLET)
          else setDeviceType(EDeviceView.DESKTOP)
          }

          checkDevice();

          const handleResize = () => {
          checkDevice();
          }

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
     }, []);

     return (
          <ViewContext.Provider value={{deviceType, setDeviceType }}>
               {children}
          </ViewContext.Provider>
     )

}

export function useView() {
     const context = useContext(ViewContext);
     if(!context) throw new Error("useView must be used within View Provider");
     return context;
}
