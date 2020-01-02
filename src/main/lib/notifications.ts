import notifier from "node-notifier";

export const showNotification = (message: string, title?: string): void => {
    const notificationTitle = title ? title : "Project Clippi";
    notifier.notify({
        title: notificationTitle,
        message,
    });
};
