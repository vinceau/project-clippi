import { FileProcessorOptions, ProcessResult, ProcessOutput } from "common/fileProcessor";


/*
const callback = (i: number, total: number, filename: string, r: ProcessResult): void => {
    dispatch.tempContainer.setPercent(Math.floor((i + 1) / total * 100));
    if (findCombos) {
        if (r.fileDeleted) {
            dispatch.tempContainer.setComboLog(`Deleted ${filename}`);
        } else {
            const base = path.basename(r.newFilename || filename);
            dispatch.tempContainer.setComboLog(`Found ${r.numCombos} highlights in: ${base}`);
        }
    } else if (renameFiles && r.newFilename) {
        dispatch.tempContainer.setComboLog(`Renamed ${filename} to ${r.newFilename}`);
    }
};
*/

export const findAndWriteCombos = async (options: FileProcessorOptions) => {
    // const result = await fileProcessor.process(options);
    // return result;
    console.log(options);
};
