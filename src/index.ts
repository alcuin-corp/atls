import fs, { read } from "fs";

interface ExportFile {
    Content: {
        Added: AnyObject[],
    };
}

interface AnyObject {
    Id: string;
    ObjectType: string;
}

interface Index {
    [key: string]: AnyObject;
}

function readExport(fileName: string): ExportFile {
    const buffer = fs.readFileSync(fileName);
    const json = buffer.toString();
    const data = JSON.parse(json) as ExportFile;
    return data;
}

function createIndex(e: ExportFile): Index {
    return e.Content.Added.reduce((acc, item) => {
        acc[item.Id] = item;
        return acc;
    }, {} as Index);
}

const jsonExport = readExport("C:\\dev\\alcuin\\atls\\201806011502_talentevo.json");
const index = createIndex(jsonExport);

console.log(index);
