import axios from "axios";
import express from "express";
const router = express.Router();

// Endpoint to get list of all projects and their builds with build time
router.get('/projects', async (req: any, res: any) => {
    try {
        const jenkinsHost = 'localhost:8080/jenkins'; // Replace with your Jenkins host
        const jobsUrl = `http://${jenkinsHost}/api/json?tree=jobs[name]`;

        const { data: { jobs } } = await axios.get(jobsUrl);

        const projects = [];

        for (const job of jobs) {
            const jobName = job.name;

            const buildsUrl = `http://${jenkinsHost}/job/${jobName}/api/json?tree=builds[number]`;

            const { data: { builds } } = await axios.get(buildsUrl);

            const projectBuilds = [];

            for (const build of builds) {
                const buildNumber = build.number;

                const buildUrl = `http://${jenkinsHost}/job/${jobName}/${buildNumber}/api/json?tree=duration`;

                const { data: { duration } } = await axios.get(buildUrl);

                projectBuilds.push({
                    buildNumber,
                    buildTime: duration
                });
            }

            projects.push({
                projectName: jobName,
                builds: projectBuilds
            });
        }

        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
export const jenkinsRouter = router;