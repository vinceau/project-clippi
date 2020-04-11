import fs from "fs-extra";

const readFiles = async (dir: string) => {
    return await fs.readdir(dir);
}

// Worker.ts
const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", async (event) => {
    console.log(event)
    const res = await readFiles(".");
    console.log(res);
});