let toastHandler = null;

export function registerToast(handler) {
  toastHandler = handler;
}

export const toast = {
  success(message) {
    toastHandler?.("success", message);
  },
  error(message) {
    toastHandler?.("error", message);
  },
  warning(message) {
    toastHandler?.("warning", message);
  },
  info(message) {
    toastHandler?.("info", message);
  },
};
