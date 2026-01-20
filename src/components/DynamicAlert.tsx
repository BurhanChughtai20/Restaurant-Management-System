"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext, ReactNode, useCallback } from "react";

type AlertType = "success" | "error" | "info";

interface Alert {
  id: string;
  message: string;
  type?: AlertType;
}

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

// Provider component
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback((message: string, type: AlertType = "info") => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`max-w-sm w-full border rounded-xl shadow-lg p-4 bg-white dark:bg-black flex items-start space-x-3
                ${alert.type === "success" ? "border-l-4 border-green-500" :
                  alert.type === "error" ? "border-l-4 border-red-500" :
                  "border-l-4 border-blue-500"}`}
            >
              <span className="text-sm text-neutral-800 dark:text-neutral-200">{alert.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
