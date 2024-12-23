import type { FormikErrors, FormikHelpers, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import classNames from "classnames";

const productFormSchema = Yup.object().shape({
  skuCode: Yup.string().required("Código is required"),
  name: Yup.string().required("Nombre is required"),
  description: Yup.string().required("Descripción is required"),
  unitPrice: Yup.number()
    .typeError("Precio must be a valid number")
    .required("Precio is required")
    .positive("Precio must be greater than zero"),
  currentStock: Yup.number()
    .typeError("Stock Actual must be a valid number")
    .required("Stock Actual is required")
    .integer("Stock Actual must be an integer")
    .positive("Precio must be greater than zero"),
  minimumStock: Yup.number()
    .typeError("Stock Mínimo must be a valid number")
    .required("Stock Mínimo is required")
    .integer("Stock Mínimo must be an integer")
    .positive("Precio must be greater than zero"),
  categoryId: Yup.number()
    .typeError("Stock Actual must be a valid number")
    .required("Stock Actual is required")
    .integer("Stock Actual must be an integer")
    .positive("Precio must be greater than zero"),
});

interface IFormInput {
  skuCode: string;
  name: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  categoryId: number;
}

export const ProductForm = ({
  categories,
  onSubmit,
}: {
  categories: { id: number; name: string }[];
  onSubmit: (values: IFormInput, helpers: FormikHelpers<IFormInput>) => void;
}) => (
  <Formik<IFormInput>
    initialValues={{
      skuCode: "",
      name: "",
      description: "",
      unitPrice: 0,
      currentStock: 0,
      minimumStock: 0,
      categoryId: 0,
    }}
    validationSchema={productFormSchema}
    onSubmit={onSubmit}
  >
    {({ errors, touched }) => (
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
          <Field as={Select} name="categoryId">
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
