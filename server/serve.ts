import app from "@/app";

console.log("🚀 Server is runnuing on http://localhost:4000 ");

Bun.serve({
    fetch: app.fetch,
    port: 4000,
    hostname: "localhost"
})