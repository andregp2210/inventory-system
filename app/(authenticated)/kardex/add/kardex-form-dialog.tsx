import { useRef, useState } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper"; // Custom Swal Wrapper
import { KardexForm } from "./kardex-form"; // Kardex Form Component
import { showErrorAlert, showSuccessAlert } from "@/components/ui/swal-dialogs"; // Custom Swal alerts
import { FormikProps } from "formik";
import Swal from "sweetalert2";
import { movementsCrud } from "@/lib/queries"; // Assuming a service for CRUD operations on movements
import { LoadingOverlay } from "@/components/ui/loading-overlay"; // Loading spinner component
import { KardexEntry, KardexRecord } from "@/lib/types/movement"; // Interface for the Kardex form data
import { Product } from "@/lib/types/product";

const LOADING_MESSAGES = ["Editando movimiento...", "Agregando movimiento..."];

export const KardexFormDialog = ({
  movement,
  getAllMovements,
  products,
}: {
  movement?: KardexRecord;
  getAllMovements: () => void;
  products: Product[]; // List of products
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const formikRef = useRef<FormikProps<KardexRecord>>(null);

  const handleAddMovement = async (values: KardexRecord) => {
    try {
      setShowLoader(true);
      const valuesToSend: KardexEntry = {
        productId: Number(values.productId),
        movementType: values.movementType,
        quantity: values.quantity,
        locationId: 1,
        movementDate: values.movementDate,
      };
      await movementsCrud.create(valuesToSend);
      showSuccessAlert("¡Movimiento añadido con éxito!");
      getAllMovements();
    } catch (err) {
      showErrorAlert(
        "Fallo al añadir movimiento",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleEditMovement = async (values: KardexRecord) => {
    try {
      setShowLoader(true);
      await movementsCrud.update(Number(values.id), { ...values }); // Assuming movement has an id
      showSuccessAlert("¡Movimiento editado con éxito!");
      getAllMovements();
    } catch (err) {
      showErrorAlert(
        "Fallo al editar movimiento",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleFormSubmit = async (values: KardexRecord) => {
    try {
      if (movement) {
        handleEditMovement(values);
      } else {
        handleAddMovement(values);
      }
    } catch (err) {
      showErrorAlert("Could not connect to the server.");
    }
  };

  return (
    <>
      {showLoader && (
        <LoadingOverlay
          message={movement ? LOADING_MESSAGES[0] : LOADING_MESSAGES[1]}
        />
      )}
      <SwalWrapper
        title={movement ? "Editar Movimiento" : "Agregar Movimiento"}
        Component={KardexForm} // The form component to use
        isEdit={!!movement}
        openDialogText={movement ? "Editar" : "Agregar movimiento"}
        componentProps={{
          onSubmit: handleFormSubmit,
          ref: formikRef,
          initialValues: movement || undefined, // Pass existing values for editing
          products, // Pass products for selection in the form
        }}
        onPreConfirm={async () => {
          if (formikRef.current) {
            await formikRef.current.submitForm();
            const isValid = formikRef.current?.isValid;
            if (!isValid) {
              Swal.showValidationMessage(
                "Por favor, corrija los errores del formulario antes de enviarlo."
              );
            }
          }
        }}
      />
    </>
  );
};
