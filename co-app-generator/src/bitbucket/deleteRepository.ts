import axios from "axios";
import { BITBUCKET_BASE_URL, PASSWORD, PROJECTS_ENDPOINT, USERNAME } from "../env";

export const deleteRepository = async (projectName: string, repositoryName: string) => {
    try {
        const deleteResponse = await axios({
            method: 'delete',
            url: `${BITBUCKET_BASE_URL}/${PROJECTS_ENDPOINT}/${projectName}/repos/${repositoryName}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        });
        return deleteResponse.data;
    } catch (error: any) {
        console.log(error.response.data);
        throw error.response.data;
    }
}