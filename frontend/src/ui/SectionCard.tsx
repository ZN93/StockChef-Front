export default function SectionCard({
                                        title,
                                        actions,
                                        children,
                                    }: {
    title: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}) {
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
