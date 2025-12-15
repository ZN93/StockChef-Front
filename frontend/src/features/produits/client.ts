export class HttpError extends Error {
    status: number;
    data: unknown;
    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export async function client<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await res.text();

    let data: unknown = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw new HttpError("HTTP error", res.status, data);
    }

    return data as T;
}
