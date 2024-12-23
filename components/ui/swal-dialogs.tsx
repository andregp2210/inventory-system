import Swal from "sweetalert2";

export const showErrorAlert = (message: string, errorDetails?: string) => {
  Swal.fire({
    icon: "error",
    title: "Ups!",
    customClass: {
      confirmButton: "bg-primary",
      cancelButton: "bg-destructive",
    },
    html: `
      <p>${message}</p>
      ${errorDetails ? `<b>Details:</b> <p>${errorDetails}</p>` : ""}
    `,
  });
};

export const showSuccessAlert = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    customClass: {
      confirmButton: "bg-primary",
      cancelButton: "bg-destructive",
    }
  });
};