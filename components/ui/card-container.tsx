import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "./skeleton";

type CardContainerProps = {
  showLoader?: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loaderClassName?: string;
  cardClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
};

const CardContainer = ({
  showLoader = false,
  title,
  children,
  footer,
  cardClassName,
  titleClassName,
  contentClassName,
  footerClassName,
  loaderClassName
}: CardContainerProps) => {
  return (
    <Card className={cardClassName}>
      {title && (
        <CardHeader>
          <CardTitle className={titleClassName}>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {showLoader ? (
          <Skeleton
            className={` ${loaderClassName ? loaderClassName : "h-12 w-full"}`}
          />
        ) : (
          <>{children}</>
        )}
      </CardContent>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

export default CardContainer;
