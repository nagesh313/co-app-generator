import axios from "axios";
import { BITBUCKET_BASE_URL, PASSWORD, PROJECTS_ENDPOINT, USERNAME } from "../env";

export const listProjects = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BITBUCKET_BASE_URL}/${PROJECTS_ENDPOINT}`,
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