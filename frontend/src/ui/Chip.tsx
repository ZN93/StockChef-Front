export function Chip({
                         children,
                         type = "default",
                     }: {
    children: React.ReactNode;
    type?: "default" | "info" | "warn" | "danger" | "success";
}) {
    const styles = {
        default: "bg-gray-100 text-gray-700",
        info: "bg-blue-100 text-blue-700",
        warn: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
        success: "bg-green-100 text-green-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}
        >
      {children}
    </span>
    );
}
