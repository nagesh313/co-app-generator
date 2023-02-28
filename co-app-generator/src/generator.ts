// Bitbucket API for initializing a repository
import { HttpStatusCode } from "axios";
import express from "express";
import { downloadTemplate, listTemplates, listTemplateVariables } from "./generator/listTemplates";
const router = express.Router();

router.get('/template/list', async (req: any, res: any) => {
    try {
        const templateList = await listTemplates();
        res.send(templateList);
    } catch (error: any) {
        res
            .status(HttpStatusCode.InternalServerError)
            .send("Unable to fetch Template List");
    }
});
router.get('/template/variables/list', async (req: any, res: any) => {
    try {
        const templateVariableList = await listTemplateVariables(req.query.templateName);
        res.send(templateVariableList);
    } catch (error: any) {
        res
            .status(HttpStatusCode.InternalServerError)
            .send("Unable to fetch Template Variable List");
    }
});
router.post('/template/download', async (req: any, res: any) => {
    const { templateName,
        templateVariableList } = req.body;
    try {
        downloadTemplate(res, templateName, templateVariableList);
    } catch (error: any) {
        res
            .status(HttpStatusCode.InternalServerError)
            .send("Unable to download Template");
    }
});

export const generatorRouter = router;