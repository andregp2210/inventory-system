import type { FormikHelpers, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import classNames from "classnames";

const productFormSchema = Yup.object().shape({
  skuCode: Yup.string()
    .required("El código es obligatorio")
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(10, "El código no debe superar los 10 caracteres"),
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
        return true; // Return true if the field is empty, as it's optional
      }
    )
    .optional(),
  unitPrice: Yup.number()
    .typeError("El precio debe ser un número válido")
    .required("El precio es obligatorio")
    .positive("El precio debe ser mayor a cero"),
  currentStock: Yup.number()
    .typeError("El stock actual debe ser un número válido")
    .required("El stock actual es obligatorio")
    .integer("El stock actual debe ser un número entero")
    .min(0, "El stock actual no puede ser negativo"),
  minimumStock: Yup.number()
    .typeError("El stock mínimo debe ser un número válido")
    .required("El stock mínimo es obligatorio")
    .integer("El stock mínimo debe ser un número entero")
    .min(0, "El stock mínimo no puede ser negativo"),
  categoryId: Yup.string().required("La categoría es obligatoria"),
});

export interface IPrudctForm {
  skuCode: string;
  name: string;
  description: string;
  unitPrice: number | string;
  currentStock: number | string;
  minimumStock: number | string;
  categoryId: string;
}

const INITIAL_VALUES: IPrudctForm = {
  skuCode: "",
  name: "",
  description: "",
  unitPrice: "",
  currentStock: "",
  minimumStock: "",
  categoryId: "",
};

export const ProductForm = ({
  categories,
  onSubmit,
  ref,
  initialValues,
}: {
  categories: { id: number; name: string }[];
  onSubmit: (values: IPrudctForm, helpers: FormikHelpers<IPrudctForm>) => void;
  ref?: React.Ref<FormikProps<IPrudctForm>>;
  initialValues?: IPrudctForm;
}) => (
  <Formik<IPrudctForm>
    initialValues={
      initialValues
        ? { ...initialValues, categoryId: initialValues.categoryId.toString() }
        : INITIAL_VALUES
    }
    validationSchema={productFormSchema}
    onSubmit={onSubmit}
    innerRef={ref}
  >
    {({ errors, touched, setFieldValue }) => (
      <Form>
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-left mb-1">
            Código
          </label>
          <Field
            as={Input}
            name="skuCode"
            placeholder="Código"
            className={classNames("rounded-xl", {
              "border-red-500": errors.skuCode && touched.skuCode,
            })}
          />
          {errors.skuCode && touched.skuCode && (
            <p className="text-red-500 text-sm">{errors.skuCode}</p>
          )}
        </div>

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
            <p className="text-red-500 text-sm">{errors.name}</p>
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
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Categoría
          </label>
          <Field
            as={Select}
            name="categoryId"
            onValueChange={(value: string) =>
              setFieldValue("categoryId", value)
            }
          >
            <SelectTrigger
              className={classNames("w-full rounded-xl", {
                "border-red-500": errors.categoryId && touched.categoryId,
              })}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Field>
          {errors.categoryId && touched.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Precio
          </label>
          <Field
            as={Input}
            name="unitPrice"
            placeholder="Precio"
            type="number"
            className={classNames("rounded-xl", {
              "border-red-500": errors.unitPrice && touched.unitPrice,
            })}
          />
          {errors.unitPrice && touched.unitPrice && (
            <p className="text-red-500 text-sm">{errors.unitPrice}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Stock Actual
          </label>
          <Field
            as={Input}
            name="currentStock"
            placeholder="Stock Actual"
            type="number"
            className={classNames("rounded-xl", {
              "border-red-500": errors.currentStock && touched.currentStock,
            })}
          />
          {errors.currentStock && touched.currentStock && (
            <p className="text-red-500 text-sm">{errors.currentStock}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Stock Mínimo
          </label>
          <Field
            as={Input}
            name="minimumStock"
            placeholder="Stock Mínimo"
            type="number"
            className={classNames("rounded-xl", {
              "border-red-500": errors.minimumStock && touched.minimumStock,
            })}
          />
          {errors.minimumStock && touched.minimumStock && (
            <p className="text-red-500 text-sm">{errors.minimumStock}</p>
          )}
        </div>
      </Form>
    )}
  </Formik>
);

export default ProductForm;
