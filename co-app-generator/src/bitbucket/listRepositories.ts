import axios from "axios";
import { BITBUCKET_BASE_URL, PASSWORD, PROJECTS_ENDPOINT, REPOSITORIES_ENDPOINT, USERNAME } from "../env";

export const listRepositories = async (projectName: string) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BITBUCKET_BASE_URL}/${PROJECTS_ENDPOINT}/${projectName}/${REPOSITORIES_ENDPOINT}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
        });
        return response.data.values;
    } catch (error: any) {
        console.log(error.response.data);
        throw error.response.data;
    }
}