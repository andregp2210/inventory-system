import type { FormikHelpers, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { Category } from "@/lib/types/category";

const categoryFormSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  description: Yup.string()
    .test(
      "description-validation",
      "La descripción debe tener al menos 10 caracteres",
      function (value) {
        if (value && value.length > 0) {
          return value.length >= 10;
        }
        return true; // Devuelve true si el campo está vacío, ya que es opcional
      }
    )
    .optional(),
});

export type CategoryFormProps = Omit<
  Category,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
> & { id: string };

const INITIAL_VALUES: CategoryFormProps = {
  name: "",
  description: "",
  id: "",
};

export const CategoryForm = ({
  onSubmit,
  ref,
  initialValues,
}: {
  onSubmit: (
    values: CategoryFormProps,
    helpers: FormikHelpers<CategoryFormProps>
  ) => void;
  ref?: React.Ref<FormikProps<CategoryFormProps>>;
  initialValues?: CategoryFormProps;
}) => (
  <Formik<CategoryFormProps>
    initialValues={
      initialValues
        ? { ...initialValues, id: initialValues.id.toString() }
        : INITIAL_VALUES
    }
    validationSchema={categoryFormSchema}
    onSubmit={onSubmit}
    innerRef={ref}
  >
    {({ errors, touched }) => (
      <Form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Nombre
          </label>
          <Field
            as={Input}
            name="name"
            placeholder="Nombre"
            className={classNames("rounded-xl", {
              "border-red-500": errors.name && touched.name,
            })}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm">{errors.name.toString()}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Descripción
          </label>
          <Field
            as={Input}
            name="description"
            placeholder="Descripción"
            className={classNames("rounded-xl", {
              "border-red-500": errors.description && touched.description,
            })}
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-sm">
              {errors.description.toString()}
            </p>
          )}
        </div>
      </Form>
    )}
  </Formik>
);

export default CategoryForm;
