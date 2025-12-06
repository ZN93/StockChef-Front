export async function client(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    // on ne fait pas res.json() directement pour pouvoir gérer les erreurs HTTP
    const text = await res.text();

    let data: any = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const error: any = new Error("HTTP error");
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}
