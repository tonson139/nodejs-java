import express from "express";
import { nanoid } from "nanoid";
const app = express();
const port = 3000;
const delaySeconds = 3;

app.use((req, res, next) => {
    const rqId = nanoid().slice(0, 7);
    req.local = { rqId };
    logger(`${req.method} ${req.url}`, rqId);
    next();
});

app.get("/", (req, res) => {
    syncFnTimer(() => {
        res.send(`Hello World! ${new Date().toISOString()}`);
    }, `${req.local.rqId}`);
});

app.get("/block/while-loop", (req, res) => {
    syncFnTimer(() => {
        const startAt = new Date();
        while ((new Date() - startAt) / 1000 < delaySeconds);
    }, `${req.local.rqId}`);
    res.sendStatus(200);
});

app.get("/block/await-while-loop", async (req, res) => {
    await asyncFnTimer(async () => {
        const startAt = new Date();
        while ((new Date() - startAt) / 1000 < delaySeconds);
    }, `${req.local.rqId}`);
    res.sendStatus(200);
});

app.get("/non-block/await", async (req, res) => {
    await asyncFnTimer(async () => {
        await delay(delaySeconds);
    }, `${req.local.rqId}`);
    res.sendStatus(200);
});

app.listen(port, () => {
    logger(`app listening on port ${port}`);
});

function logger(msg, prefix) {
    console.log(
        `${process.pid} ${new Date().toISOString()} [${prefix}] - ${msg}`
    );
}

async function delay(seconds) {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, seconds * 1000)
    );
}

async function asyncFnTimer(fn, rqId) {
    const startAt = new Date();
    await fn();
    const endAt = new Date();
    logger(`${endAt - startAt} ms`, rqId);
}

function syncFnTimer(fn, rqId) {
    const startAt = new Date();
    fn();
    const endAt = new Date();
    logger(`${endAt - startAt} ms`, rqId);
}
