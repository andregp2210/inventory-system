import type { FormikHelpers, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { Category } from "@/lib/types/category";

const categoryFormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Nombre is required")
    .min(3, "Nombre must be at least 3 characters"),
  description: Yup.string()
    .test(
      "description-validation",
      "Descripción must be at least 10 characters",
      function (value) {
        if (value && value.length > 0) {
          return value.length >= 10;
        }
        return true; // Return true if the field is empty, as it's optional
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
            <p className="text-red-500 text-sm">{errors.description.toString()}</p>
          )}
        </div>
      </Form>
    )}
  </Formik>
);

export default CategoryForm;
