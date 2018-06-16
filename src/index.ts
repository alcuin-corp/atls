import { createIndex, readExportFile, Graph } from "./utils";

const exportFile = readExportFile("C:\\dev\\alcuin\\atls\\talentevo.json");
// const resultFile = readResultFile("C:\\dev\\alcuin\\atls\\result.json");
const index = createIndex(exportFile);

const g = new Graph(index);

console.log(g.parentsOf("fd1c9854-d5ba-4c22-891f-a79000ca6417"));
console.log(g.childrenOf("b64ca4d5-a726-487e-a3ff-a5b000e78501"));
