export const formatCurrency = (n: number | undefined | null) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(n ?? 0);