import { createClient } from "@/utils/supabase/client";
import type { FormikErrors, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface IFormInput {
  name: string;
  email: string;
}
let formikRef: FormikProps<IFormInput> | null = null;

const MySwal = withReactContent(Swal);

const newProduct = {
  skuCode: "SKU0013323",
  name: "Laptop",
  description: "High-performance laptop",
  unitPrice: 999.99,
  currentStock: 20,
  minimumStock: 5,
  categoryId: 1,
  supplierId: 1,
  createdBy: "admin",
};

const ProductForm = ({
  setShouldRefreshProducts,
}: {
  setShouldRefreshProducts: (value: boolean) => void;
}) => {
  const supabase = createClient();

  const onSubmit = async (formData: IFormInput) => {
    try {
      // Simulate API call
      const { data, error } = await supabase
        .from("products")
        .insert([{ ...newProduct, skuCode: formData.name }])
        .single();
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Ups!",
          html: `
                  Something went wrong. Please try again.
                  <br/>
                  <b>Server Error:</b>
                  <p>${error.message}</p>
                `,
        });
      } else {
        setShouldRefreshProducts(true);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your form was submitted successfully.",
        });
        //reset(); // Reset the form
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Unable to reach the server. Please check your connection.",
      });
    }
  };

  const showCustomFormModal = () => {
    MySwal.fire({
      title: "Custom Form",
      html: (
        <Formik<IFormInput>
          innerRef={(ref) => {
            formikRef = ref;
          }}
          initialValues={{ name: "", email: "" }}
          validate={(values) => {
            const errors: FormikErrors<IFormInput> = {};
            if (!values.name) {
              errors.name = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            }
            return errors;
          }}
          onSubmit={onSubmit}
        >
          <Form>
            <Field
              type="text"
              className="swal2-input"
              name="name"
              // onKeyPress={(event: React.KeyboardEvent) =>
              //   event.key === "Enter" && Swal.clickConfirm()
              // }
            />
            <Field
              type="text"
              className="swal2-input"
              name="email"
              // onKeyPress={(event: React.KeyboardEvent) =>
              //   event.key === "Enter" && Swal.clickConfirm()
              // }
            />
          </Form>
        </Formik>
      ),
      showCancelButton: true,
      confirmButtonText: "Submit",
      didOpen: () => {
        Swal.getPopup()?.querySelector("input")?.focus();
      },
      preConfirm: async () => {
        await formikRef?.submitForm();
        if (formikRef) {
          if (formikRef.isValid) {
            Swal.fire({
              title: formikRef.values.email,
              icon: "success",
            });
          } else {
            Swal.showValidationMessage(JSON.stringify(formikRef?.errors));
          }
        }
      },
    });
  };

  return (
    <button
      onClick={showCustomFormModal}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Add product
    </button>
  );
};

export default ProductForm;
