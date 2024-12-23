import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const SwalWrapper = ({
  title,
  Component,
  openDialogText,
  confirmButtonText = "Submit",
  componentProps,
  onPreConfirm,
  onError,
  onSuccess,
}: {
  title: string;
  Component: React.ElementType;
  componentProps?: any;
  confirmButtonText?: string;
  openDialogText: string;
  onPreConfirm: () => Promise<void>;
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const showSwal = () => {
    MySwal.fire({
      title,
      html:( <Component {...componentProps} />),
      showCancelButton: true,
      confirmButtonText,
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-destructive",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.zIndex = "9"; // Set your desired z-index value
          popup.querySelector("input")?.focus();
        }
      },
      preConfirm: async () => {
        try {
          await onPreConfirm();
          if (onSuccess) onSuccess();
        } catch (err) {
          if (onError) onError();
          throw err;
        }
      },
    });
  };

  return (
    <button
      onClick={showSwal}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      {openDialogText}
    </button>
  );
};
