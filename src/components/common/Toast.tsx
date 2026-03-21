"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, duration = 4000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev.slice(-2), toast]); // Keep max 3 toasts

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "success", duration);
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "error", duration);
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "info", duration);
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "warning", duration);
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info, warning }}
    >
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Toast item component
export function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  const backgroundColors = {
    success: "bg-success",
    error: "bg-error",
    info: "bg-accent",
    warning: "bg-accent",
  };

  return (
    <div
      className={`animate-in slide-in-from-right ${backgroundColors[toast.type]} flex items-center bg-ink text-canvas px-4 py-3 rounded-md shadow-lg flex items-start gap-3 max-w-sm`}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 hover:opacity-75 transition-opacity"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toaster display component
function Toaster({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
