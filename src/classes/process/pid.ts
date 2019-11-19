import * as fs from "fs";
import * as cluster from "cluster";
import { config } from "./../config";
import { id } from "./id";
import { log } from "./../log";

function sanitizeId() {
  let pidfile = String(id).trim();
  pidfile = pidfile.replace(new RegExp(":", "g"), "-");
  pidfile = pidfile.replace(new RegExp(" ", "g"), "_");

  return pidfile;
}

export const pid = process.pid;
const path = config.general.paths.pid[0]; // it would be silly to have more than one pi
let title = sanitizeId();

if (cluster.isMaster) {
  title = "actionhero-" + title;
}

try {
  fs.mkdirSync(path);
} catch (e) {}

export function writePidFile() {
  log(`pid: ${process.pid}`, "notice");
  fs.writeFileSync(path + "/" + title, pid.toString(), "ascii");
}

export function clearPidFile() {
  try {
    fs.unlinkSync(path + "/" + title);
  } catch (error) {
    log("Unable to remove pidfile", "error", error);
  }
}

// async start() {
//   api.pids.writePidFile();
//
// }
