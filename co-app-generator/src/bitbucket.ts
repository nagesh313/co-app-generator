// Bitbucket API for initializing a repository
import axios from "axios";
import express from "express";
import { createRepository } from "./bitbucket/createRepository";
import { deleteRepository } from "./bitbucket/deleteRepository";
import { listProjects } from "./bitbucket/listProjects";
import { listRepositories } from "./bitbucket/listRepositories";
import { BITBUCKET_BASE_URL, PASSWORD, USERNAME } from "./env";

const REPOSITORIES_ENDPOINT = 'repositories';
const SRC_ENDPOINT = 'src';
const PUSH_ENDPOINT = 'push';
const router = express.Router();

router.get('/repositories/:repositoryName', async (req: any, res: any) => {
    try {
        const repositoryName = req.params.repositoryName;
        const initResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${REPOSITORIES_ENDPOINT}/${USERNAME}/${repositoryName}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        });
        res.send(initResponse.data);
    } catch (error: any) {
        res.status(error.response.status).send(error.response.data);
    }
});

router.post('/repositories/:repositoryName/commits', async (req: any, res: any) => {
    try {
        const repositoryName = req.params.repositoryName;
        const { message, branch, files } = req.body;
        const commitData = {
            message,
            branch,
            parents: [],
            author: {
                raw: `${USERNAME} <${USERNAME}@users.noreply.bitbucket.org>`
            },
            files: files.map((file: any) => ({
                ...file,
                content: Buffer.from(file.content).toString('base64')
            }))
        };
        const commitResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${REPOSITORIES_ENDPOINT}/${USERNAME}/${repositoryName}/commits`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            data: commitData
        });
        res.send(commitResponse.data);
    } catch (error: any) {
        res.status(error.response.status).send(error.response.data);
    }
});

router.post('/repositories/:repositoryName/src/:branch', async (req: any, res: any) => {
    try {
        const repositoryName = req.params.repositoryName;
        const branch = req.params.branch;
        const { files } = req.body;
        const commitData = {
            message: 'Add files',
            branch,
            parents: ['default'],
            author: {
                raw: `${USERNAME} <${USERNAME}@users.noreply.bitbucket.org>`
            },
            files: files.map((file: any) => ({
                ...file,
                content: Buffer.from(file.content).toString('base64')
            }))
        };
        const commitResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${REPOSITORIES_ENDPOINT}/${USERNAME}/${repositoryName}/${SRC_ENDPOINT}/${branch}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            data: commitData
        });
        res.send(commitResponse.data);
    } catch (error: any) {
        res.status(error.response.status).send(error.response.data);
    }
});

router.post('/repositories/:repositoryName/push', async (req: any, res: any) => {
    try {
        const repositoryName = req.params.repositoryName;
        const { branch } = req.body;
        const pushResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${REPOSITORIES_ENDPOINT}/${USERNAME}/${repositoryName}/${PUSH_ENDPOINT}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            data: {
                target: {
                    hash: branch
                }
            }
        });
        res.send(pushResponse.data);
    } catch (error: any) {
        res.status
    }
})

//create a new repository in a project
router.post('/repositories', async (req: any, res: any) => {
    const { repositoryName, projectName } = req.body;
    try {
        const response = await createRepository(projectName, repositoryName);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
});
//fetch all projects
router.get('/projects', async (req: any, res: any) => {
    try {
        const response = await listProjects();
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
});
//fetch all repositories in a project
router.get('/projects/:projectName/repositories', async (req: any, res: any) => {
    const projectName = req.params.projectName;
    try {
        const response = await listRepositories(projectName);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
});
router.delete('/:projectName/repositories/:repositoryName', async (req: any, res: any) => {
    const { projectName, repositoryName } = req.params;
    try {
        const response = await deleteRepository(projectName, repositoryName);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(400).json(error);
    }
});

export const bitbucketRouter = router;