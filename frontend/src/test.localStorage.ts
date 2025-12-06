// src/test.localStorage.ts
import { vi } from "vitest";

declare global {
    // On ajoute le type dans le global pour TS
    // (Node 22 donne un truc bizarre)
     
    var localStorage: Storage;
}

// Si localStorage est absent ou cassé → on remplace
if (
    typeof globalThis.localStorage === "undefined" ||
    typeof globalThis.localStorage.getItem !== "function"
) {
    const store = new Map<string, string>();

    const localStorageMock: Storage = {
        getItem: vi.fn((key: string) => store.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
            store.delete(key);
        }),
        clear: vi.fn(() => {
            store.clear();
        }),
        key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
        get length() {
            return store.size;
        },
    };

    globalThis.localStorage = localStorageMock;
}
