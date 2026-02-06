import { DynamicCardFormProps } from "@/app/store/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


interface ActionButton {
  text: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export const DynamicCardForm: React.FC<DynamicCardFormProps> = ({
  title,
  description,
  actionButton,
  fields,
  footerButtons,
  extraHeaderAction,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen my-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.actionLink && (
                    <Link
                      href={field.actionLink.href}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {field.actionLink.text}
                    </Link>
                  )}
                </div>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            ))}
          </form>

          {actionButton && (
            <div className="mt-6">
              <Button
                size={actionButton.size ?? "default"}
                onClick={actionButton.onClick}
                className={`w-full ${actionButton.className ?? ""}`}
              >
                {actionButton.text}
              </Button>
            </div>
          )}

          {extraHeaderAction && <div className="mt-4">{extraHeaderAction}</div>}
        </CardContent>

        {footerButtons && (
          <CardFooter className="flex flex-col gap-2 mt-4">
            {footerButtons.map((btn, index) => (
              <Button
                key={index}
                size={btn.size ?? "default"}
                type={(btn as ActionButton).type || "button"}
                onClick={btn.onClick}
                className="w-full"
              >
                {btn.text}
              </Button>
            ))}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};