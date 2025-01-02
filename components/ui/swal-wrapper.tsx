import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  isEdit = false,
}: {
  title: string;
  Component: React.ElementType;
  componentProps?: any;
  confirmButtonText?: string;
  openDialogText: string;
  onPreConfirm: () => Promise<void>;
  onError?: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
}) => {
  const showSwal = () => {
    MySwal.fire({
      title,
      html: <Component {...componentProps} />,
      showCancelButton: true,
      confirmButtonText,
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-destructive",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.zIndex = "9";
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
    <Button
      variant={isEdit ? "outline" : "default"}
      className="px-4 py-2 rounded-md hover:bg-blue-600 flex-1 mr-2"
      onClick={showSwal}
    >
      {isEdit && <Edit className="mr-2 h-4 w-4" />}
      <span>{openDialogText}</span>
    </Button>
  );
};
