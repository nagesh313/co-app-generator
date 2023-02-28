import axios from "axios";
import { BITBUCKET_BASE_URL, PASSWORD, PROJECTS_ENDPOINT, USERNAME } from "../env";

export const createRepository = async (projectName: string, name: string, description = "") => {
    try {
        const createResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${PROJECTS_ENDPOINT}/${projectName}/repos`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            data: {
                name,
                description
            }
        });
        return createResponse.data;
    } catch (error: any) {
        console.log(error.response.data);
        throw error.response.data;
    }
}
