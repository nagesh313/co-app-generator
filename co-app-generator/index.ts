// const express = require('express');


import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
import { generatorRouter } from "./src/generator"
import { bitbucketRouter } from "./src/bitbucket"
import { progressRouter } from "./src/progress"
import { jenkinsRouter } from "./src/jenkins"
import { listProjects } from "./src/bitbucket/listProjects";
import { deleteProject } from "./src/bitbucket/deleteProject";
import { createProject } from "./src/bitbucket/createProject";
import { createRepository } from "./src/bitbucket/createRepository";
import { deleteRepository } from "./src/bitbucket/deleteRepository";
import cors from "cors";

const port = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/generator", generatorRouter)
app.use("/api/v1/jenkins", jenkinsRouter)
app.use("/api/v1/bitbucket", bitbucketRouter)
app.use("/api/v1/event", progressRouter)
const test = async () => {
    let repositories = await listProjects();
    // await createProject("AIHADES", "AIHADES", "AIHADES");
    // await createProject("C3AI", "C3AI", "C3AI");
    // await createProject("OEHIVE", "OEHIVE", "OEHIVE");
    await createRepository("AIHADES", "AIHADES-1");
    await createRepository("AIHADES", "AIHADES-2");
    await createRepository("AIHADES", "AIHADES-3");


    await createRepository("C3AI", "C3AI-1");
    await createRepository("C3AI", "C3AI-2");
    await createRepository("C3AI", "C3AI-3");

    await createRepository("OEHIVE", "OEHIVE-1");
    await createRepository("OEHIVE", "OEHIVE-2");
    await createRepository("OEHIVE", "OEHIVE-3");


    // await createRepository("test" + repositories.length, "test-repo" + repositories.length, "TestRepoDesc")
    await deleteRepository("test1", "test-repo1");
    await deleteProject("test1");
    // repositories = await listProjects();
    console.log(repositories);
    console.log(repositories.length);
}
// test();
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});