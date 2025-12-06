import type { ReactNode } from "react";

export const formatCurrency = (n: number | undefined | null) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(n ?? 0);

type ChipProps = {
    children: ReactNode;
    type?: "default" | "info" | "warn" | "danger" | "success";
};

export function Chip({ children, type = "default" }: ChipProps) {
    const styles: Record<NonNullable<ChipProps["type"]>, string> = {
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

type SectionCardProps = {
    title: string;
    actions?: ReactNode;
    children: ReactNode;
};

export function SectionCard({ title, actions, children }: SectionCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg md:text-xl font-semibold tracking-tight">
                    {title}
                </h3>
                <div className="flex gap-2">{actions}</div>
            </div>
            {children}
        </div>
    );
}

type KPIProps = {
    title: string;
    value: string;
    subtitle?: string;
    tone?: "info" | "warn" | "danger" | "success";
};

export function KPI({
                        title,
                        value,
                        subtitle,
                        tone = "info",
                    }: KPIProps) {
    const tones: Record<NonNullable<KPIProps["tone"]>, string> = {
        info: "bg-blue-50 border-blue-100",
        warn: "bg-amber-50 border-amber-100",
        danger: "bg-red-50 border-red-100",
        success: "bg-green-50 border-green-100",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="text-sm text-gray-600">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
            {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
    );
}
