import { forwardRef } from "react";
import type {
  FieldsetHTMLAttributes,
  HTMLAttributes,
  LabelHTMLAttributes,
} from "react";

// Small helper so we don't need clsx/cva for a handful of conditional classes.
function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type FieldOrientation = "vertical" | "horizontal" | "responsive";

const orientationClasses: Record<FieldOrientation, string> = {
  vertical: "flex-col",
  horizontal: "flex-row items-center",
  responsive: "flex-col @md/field-group:flex-row @md/field-group:items-center",
};

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: FieldOrientation;
}

/** A single form field: groups a label, its control, a description and an error. */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { orientation = "vertical", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cx(
        "group/field flex w-full gap-2 [&[data-orientation=vertical]>*]:w-full",
        orientationClasses[orientation],
        className,
      )}
      {...props}
    />
  );
});

export interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {}

/** Vertical stack of Fields (and/or FieldSets), with consistent spacing between them. */
export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(function FieldGroup(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("@container/field-group flex w-full flex-col gap-6", className)}
      {...props}
    />
  );
});

export interface FieldSetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {}

/** Groups related Fields under a shared legend, e.g. a section of a form. */
export const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(function FieldSet(
  { className, ...props },
  ref,
) {
  return (
    <fieldset ref={ref} className={cx("flex flex-col gap-6", className)} {...props} />
  );
});

export interface FieldLegendProps extends HTMLAttributes<HTMLLegendElement> {
  variant?: "legend" | "label";
}

/** The legend for a FieldSet. `variant="label"` reads at the same size as a FieldLabel. */
export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(function FieldLegend(
  { variant = "legend", className, ...props },
  ref,
) {
  return (
    <legend
      ref={ref}
      className={cx(
        "mb-2 font-medium text-gray-900",
        variant === "legend" ? "text-base" : "text-sm",
        className,
      )}
      {...props}
    />
  );
});

export interface FieldContentProps extends HTMLAttributes<HTMLDivElement> {}

/** Wraps a FieldLabel + FieldDescription pair on the label side of a horizontal Field. */
export const FieldContent = forwardRef<HTMLDivElement, FieldContentProps>(function FieldContent(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  );
});

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

/** Label for a Field's control. Pass `htmlFor` to associate it with the input. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cx(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug text-gray-900",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

export interface FieldTitleProps extends HTMLAttributes<HTMLDivElement> {}

/** Like FieldLabel, but not an actual `<label>` — for titles inside a custom control. */
export const FieldTitle = forwardRef<HTMLDivElement, FieldTitleProps>(function FieldTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("flex w-fit items-center gap-2 text-sm font-medium text-gray-900", className)}
      {...props}
    />
  );
});

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Helper text under a Field's label or control. */
export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cx("text-sm leading-normal text-gray-500", className)}
        {...props}
      />
    );
  },
);

export interface FieldErrorProps extends HTMLAttributes<HTMLDivElement> {
  errors?: Array<{ message?: string } | undefined>;
}

/** Validation message for a Field. Pass `children`, or `errors` from a form library. */
export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, children, errors, ...props },
  ref,
) {
  const messages =
    children != null
      ? null
      : [...new Map((errors ?? []).map((error) => [error?.message, error])).values()]
          .map((error) => error?.message)
          .filter((message): message is string => Boolean(message));

  if (children == null && (!messages || messages.length === 0)) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cx("text-sm font-normal text-red-600", className)}
      {...props}
    >
      {children ??
        (messages!.length === 1 ? (
          messages![0]
        ) : (
          <ul className="ml-4 list-disc space-y-1">
            {messages!.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ))}
    </div>
  );
});

export interface FieldSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

/** A labelled or unlabelled divider between Fields, e.g. "or". */
export const FieldSeparator = forwardRef<HTMLDivElement, FieldSeparatorProps>(
  function FieldSeparator({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx("relative -my-1 flex items-center text-sm text-gray-500", className)}
        {...props}
      >
        <span aria-hidden className="h-px flex-1 bg-gray-200" />
        {children && <span className="mx-2 shrink-0">{children}</span>}
        <span aria-hidden className="h-px flex-1 bg-gray-200" />
      </div>
    );
  },
);
