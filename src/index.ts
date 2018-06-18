import * as utils from "./utils";
import { Graph } from "./utils";

const exportFile = utils.readExportFile("C:\\dev\\alcuin\\atls\\talentevo.json");
const resultFile = utils.readResultFile("C:\\dev\\alcuin\\atls\\result.json");
const index = utils.createIndex(exportFile);

utils.printAllInducedFailures(new Graph(index), resultFile);
