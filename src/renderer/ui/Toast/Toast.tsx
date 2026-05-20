import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { CheckCircle, CircleAlert, Info, TriangleAlert, X } from "lucide-react";
import { clsx } from "clsx";
import styles from "./Toast.module.css";

type ToastType = "info" | "success" | "error" | "warning";

const iconMap: Record<ToastType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  error: CircleAlert,
  warning: TriangleAlert,
};

const manager = BaseToast.createToastManager();

interface ToastOptions {
  toastId?: string;
  autoClose?: number | false;
  onClose?: () => void;
  onRemove?: () => void;
}

function addToast(type: ToastType, content: string | React.ReactNode, opts?: ToastOptions): string {
  const options: Record<string, unknown> = {
    type,
    timeout: opts?.autoClose === false ? 0 : (opts?.autoClose ?? 5000),
    onClose: opts?.onClose,
    onRemove: opts?.onRemove,
  };

  if (opts?.toastId) {
    options.id = opts.toastId;
  }

  if (typeof content === "string") {
    options.title = content;
  } else {
    options.data = { content };
  }

  return manager.add(options as any);
}

export const toast = {
  info: (content: string | React.ReactNode, opts?: ToastOptions): string => addToast("info", content, opts),
  success: (content: string | React.ReactNode, opts?: ToastOptions): string => addToast("success", content, opts),
  error: (content: string | React.ReactNode, opts?: ToastOptions): string => addToast("error", content, opts),
  warning: (content: string | React.ReactNode, opts?: ToastOptions): string => addToast("warning", content, opts),
  dismiss: (id?: string): void => manager.close(id),
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((t) => {
    const toastType = (t.type as ToastType) || "info";
    const Icon = iconMap[toastType];
    const customData = t.data as { content?: React.ReactNode } | null;
    const hasCustomContent = customData?.content != null;

    return (
      <BaseToast.Root key={t.id} toast={t} className={clsx(styles.toast, styles[toastType])}>
        <div className={styles.coloredBar} />
        <div className={styles.iconWrapper}>
          <Icon size={22} />
        </div>
        <BaseToast.Content className={styles.content}>
          {hasCustomContent ? (
            <div>{customData!.content}</div>
          ) : (
            <>
              {t.title && <BaseToast.Title className={styles.title} />}
              {t.description && <BaseToast.Description className={styles.description} />}
            </>
          )}
        </BaseToast.Content>
        <BaseToast.Close className={styles.close} aria-label="Close">
          <X size={18} />
        </BaseToast.Close>
      </BaseToast.Root>
    );
  });
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseToast.Provider toastManager={manager}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className={styles.viewport}>
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export const Toast = {
  Provider: ToastProvider,
};
