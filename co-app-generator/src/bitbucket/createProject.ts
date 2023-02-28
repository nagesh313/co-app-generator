import axios from "axios";
import { BITBUCKET_BASE_URL, PASSWORD, PROJECTS_ENDPOINT, USERNAME } from "../env";

export const createProject = async (key: string, name: string, description = "") => {
    try {
        const createResponse = await axios({
            method: 'post',
            url: `${BITBUCKET_BASE_URL}/${PROJECTS_ENDPOINT}`,
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            data: {
                key, name, description
            }
        });
        return createResponse.data;
    } catch (error: any) {
        console.log(error.response.data);
        throw error.response.data;
    }
}
