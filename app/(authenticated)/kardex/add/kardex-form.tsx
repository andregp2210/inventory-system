import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { Product } from "@/lib/types/product";

interface IKardexForm {
  movementType: string;
  productId: string;
  quantity: number;
}

const kardexFormSchema = Yup.object().shape({
  movementType: Yup.string().required("Movimiento es obligatorio"),
  productId: Yup.string().required("Producto es obligatorio"),
  quantity: Yup.number()
    .positive("La cantidad debe ser mayor que 0")
    .required("Cantidad es obligatoria"),
});

export const KardexForm = ({
  products,
  onSubmit,
  initialValues,
  ref,
}: {
  products: Product[];
  onSubmit: (values: IKardexForm, helpers: FormikHelpers<IKardexForm>) => void;
  initialValues?: IKardexForm;
  ref?: React.Ref<any>;
}) => (
  <Formik<IKardexForm>
    initialValues={
      initialValues || {
        movementType: "",
        productId: "",
        quantity: 0,
      }
    }
    validationSchema={kardexFormSchema}
    onSubmit={onSubmit}
    innerRef={ref}
  >
    {({ errors, touched, setFieldValue }) => (
      <Form>
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-left mb-1">
            Tipo de Movimiento
          </label>
          <Field
            as={Select}
            name="movementType"
            onValueChange={(value: string) =>
              setFieldValue("movementType", value)
            }
            className={classNames("w-full rounded-xl", {
              "border-red-500": errors.movementType && touched.movementType,
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo de movimiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="entry">Entrada</SelectItem>
                <SelectItem value="exit">Salida</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Field>
          {errors.movementType && touched.movementType && (
            <p className="text-red-500 text-sm">{errors.movementType}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Producto
          </label>
          <Field
            as={Select}
            name="productId"
            onValueChange={(value: string) => setFieldValue("productId", value)}
            className={classNames("w-full rounded-xl", {
              "border-red-500": errors.productId && touched.productId,
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Field>
          {errors.productId && touched.productId && (
            <p className="text-red-500 text-sm">{errors.productId}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-1">
            Cantidad
          </label>
          <Field
            as={Input}
            name="quantity"
            placeholder="Cantidad"
            type="number"
            className={classNames("rounded-xl", {
              "border-red-500": errors.quantity && touched.quantity,
            })}
          />
          {errors.quantity && touched.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity}</p>
          )}
        </div>
      </Form>
    )}
  </Formik>
);
