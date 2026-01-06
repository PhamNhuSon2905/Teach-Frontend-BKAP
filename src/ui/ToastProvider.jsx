import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { registerToast } from "./toast";

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    registerToast((severity, message) => {
      setToast({ severity, message });
    });
  }, []);

  return (
    <>
      {children}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {toast && (
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast(null)}
          >
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
