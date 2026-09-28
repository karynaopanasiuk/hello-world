import { forwardRef } from "react";
import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import closeIcon from "../assets/notification/close.svg";
import errorIcon from "../assets/notification/error.svg";
import infoIcon from "../assets/notification/info.svg";
import successIcon from "../assets/notification/success.svg";
import warningIcon from "../assets/notification/warning.svg";

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationSize = "xs" | "sm";

export interface NotificationAction {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  type?: NotificationType;
  /** `xs` is a single line; `sm` adds a description and up to two actions. */
  size?: NotificationSize;
  title: ReactNode;
  /** Only shown for `size="sm"`. */
  description?: ReactNode;
  /** `xs`: outlined button next to the title. `sm`: filled button under the description. */
  primaryAction?: NotificationAction;
  /** Only shown for `size="sm"`: light button next to the primary one. */
  secondaryAction?: NotificationAction;
  /** When provided, a dismiss (×) button is shown and calls this handler. */
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  dismissLabel?: string;
  showIcon?: boolean;
}

const icons: Record<NotificationType, string> = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon,
};

// Sizes and colors come from the "Notification" component in the Figma design system
// (Type = Info/Success/Warning/Error, Size = Xs/Sm). Hex values are the Figma variable
// fallbacks: text/default #21242e, text/theme #1b68fa, border/default #d4dced.
const base =
  "flex w-full max-w-[400px] gap-2 rounded-[10px] bg-white " +
  "font-['Inter_Variable',Inter,sans-serif] shadow-[0_8px_46px_-4px_rgba(111,109,120,0.15)]";

const sizes: Record<NotificationSize, string> = {
  xs: "items-center px-3 py-2.5",
  sm: "items-start px-3.5 py-3",
};

const actionBase =
  "inline-flex h-6 shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold " +
  "leading-[1.4] whitespace-nowrap transition hover:brightness-95 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-[#1b68fa] focus-visible:ring-offset-1";

const actionVariants = {
  outline: "border border-[#d4dced] bg-white text-[#21242e]",
  light: "bg-[#1b68fa]/10 text-[#1b68fa]",
  filled: "bg-[#1b68fa] text-white",
} as const;

function ActionButton({
  action,
  variant,
}: {
  action: NotificationAction;
  variant: keyof typeof actionVariants;
}) {
  return (
    <button
      type="button"
      onClick={action.onClick}
      className={`${actionBase} ${actionVariants[variant]}`}
    >
      {action.label}
    </button>
  );
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(function Notification(
  {
    type = "info",
    size = "xs",
    title,
    description,
    primaryAction,
    secondaryAction,
    onDismiss,
    dismissLabel = "Закрити",
    showIcon = true,
    className,
    ...props
  },
  ref,
) {
  const isSm = size === "sm";
  const classes = [base, sizes[size], className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      role={type === "error" || type === "warning" ? "alert" : "status"}
      className={classes}
      {...props}
    >
      {showIcon && <img src={icons[type]} alt="" className="size-6 shrink-0" />}

      {isSm ? (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-[1.4] font-medium text-[#21242e]">{title}</p>
            {description && (
              <p className="flex min-h-10 items-center text-sm leading-[1.4] font-normal text-[#21242e]">
                {description}
              </p>
            )}
          </div>
          {(primaryAction || secondaryAction) && (
            <div className="flex items-start gap-2">
              {secondaryAction && <ActionButton action={secondaryAction} variant="light" />}
              {primaryAction && <ActionButton action={primaryAction} variant="filled" />}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="min-w-0 flex-1 text-sm leading-[1.4] font-medium text-[#21242e]">{title}</p>
          {primaryAction && <ActionButton action={primaryAction} variant="outline" />}
        </>
      )}

      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="flex size-6 shrink-0 items-center justify-center rounded-md px-1 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b68fa]"
        >
          <img src={closeIcon} alt="" className="size-3.5" />
        </button>
      )}
    </div>
  );
});
