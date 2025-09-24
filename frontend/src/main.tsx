if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" }, onUnhandledRequest: "bypass" });
}
