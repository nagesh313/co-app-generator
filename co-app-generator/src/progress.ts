// Progress API to simulate RealTimeProgress
import { HttpStatusCode } from "axios";
import express, { response } from "express";
const router = express.Router();

const SSE = new Map();
const headers = {
    'Content-Type': "text/event-stream",
    "Connection": 'keep-alive',
    'Cache-Control': 'no-cache'
}
const createSSEEvent = (uuid: string, request: any, response: any) => {
    response.writeHead(200, headers);
    response.write(uuid);
    const newClient = {
        id: uuid,
        response
    };
    SSE.set(uuid, newClient);
    request.on('close', () => {
        console.log("Connection closed");
        console.log(uuid);
        SSE.delete(uuid);
    })
}
router.get('/progress', (req: any, res: any) => {
    const uuid = req.query.uuid;;
    console.log(uuid);
    try {
        createSSEEvent(uuid, req, res);
    } catch (error: any) {
        res
            .status(HttpStatusCode.InternalServerError)
            .send("Unable to fetch Template List");
    }
});
const sampleTask = [
    "Caching",
    "Load-balancing",
    "Scaling",
    "Profiling",
    "Debugging",
    "Securing",
    "Logging",
    "Optimizing",
    "Testing",
    "Refactoring",
    "Authenticating",
    "Authoring",
    "Serializing",
    "Compressing",
    "Validating",
]
const sleep = (time: number) => {
    return new Promise((resolve: any) => {
        setTimeout(resolve, time);
    })
}
const simulation = async (uuid: string, eventCount: number) => {
    const count = eventCount % sampleTask.length;
    const client = SSE.get(uuid);
    const data = sampleTask.slice(sampleTask.length - count).map((value: string) => { return { value, sort: Math.random() } })
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }: any) => value);
    for (let element of data) {
        let sleepTime = Math.random() * 1000;
        sleepTime = sleepTime % 4;
        sleepTime = Math.ceil(sleepTime);
        sleepTime = sleepTime * 1000;
        await sleep(sleepTime)
        console.log(sleepTime, element)
        client.response.write(`data: ${JSON.stringify(element)}\n\n`)
        console.log("===================");
    }
    // .forEach(async (value: string, index: any) => {
    //     let sleepTime = Math.random() * 1000;
    //     sleepTime = sleepTime % 10;
    //     sleepTime = Math.ceil(sleepTime);
    //     sleepTime = sleepTime * index;
    //     await sleep(sleepTime)
    //     console.log(sleepTime);
    //     console.log(value);
    //     client.write("" + value);
    // })

}
router.get('/start-simulation/:uuid/:eventCount', async (req: any, res: any) => {
    try {
        const eventCount = req.params.eventCount;
        const uuid = req.params.uuid;
        await simulation(uuid, eventCount);
        // const templateVariableList = await listTemplateVariables(req.query.templateName);
        // res.send();
    } catch (error: any) {
        res
            .status(HttpStatusCode.InternalServerError)
            .send("Unable to fetch Template Variable List");
    }
});

export const progressRouter = router;