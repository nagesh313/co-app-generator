import fs from "fs";
import { TEMPLATE_DIRECTORY, TEMPLATE_VARIABLE_REGEX } from "../env";
import AdmZip from "adm-zip";
import glob from "glob";
export const listTemplates = async () => {
    try {
        const directories = listDirectories(TEMPLATE_DIRECTORY)
        return directories;
    } catch (error: any) {
        console.log("Unable to list the directories");
        throw error;
    }
}

export const listTemplateVariables = (templateName: string) => {
    let placeholders = getVariableList(TEMPLATE_DIRECTORY + "/" + templateName)
    return placeholders;
}
export const downloadTemplate = async (res: any, templateName: string, variableList: any) => {
    const zip = await zipFolder(templateName);
    //TODO replace the variables
    writeFileToReponse(res, zip, templateName);
}

const getVariableList = (path: string) => {
    const variableSet = new Set();
    const list = glob.sync(path + "/**/*", {})
        .filter((file: any) => fs.lstatSync(file).isFile());
    list?.forEach(async (file: any) => {
        const content = fs.readFileSync(file, 'utf-8');
        const found = content.match(TEMPLATE_VARIABLE_REGEX);
        found?.forEach((str: string) => {
            let temp = str;
            temp = temp.replace("<%= ", "");
            temp = temp.replace(" =%>", "");
            variableSet.add(temp)
        })
    });
    // console.log(variableSet.size);
    // console.log(list);
    return [...variableSet]
}


const listDirectories = (path: string) => {
    const dir = fs.opendirSync(path);
    let entity;
    const listing = [];
    while ((entity = dir.readSync()) !== null) {
        if (entity.isDirectory()) {
            listing.push(entity.name);
        }
    }
    dir.closeSync();
    return listing;
}

const zipFolder = async (path: string) => {
    const zip = new AdmZip();
    await zip.addLocalFolder(TEMPLATE_DIRECTORY + "/" + path)
    return zip;
}
const writeFileToReponse = (res: any, zip: any, directoryName: string) => {
    const buffer = zip.toBuffer();
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Disposition", "attachment;filename=" + directoryName + ".zip");
    res.write(buffer, "binary");
    res.end();
}

// listTemplateVariables("spring-template")
// listTemplateVariables("react-template")