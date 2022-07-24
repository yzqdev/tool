import * as os from "os";
import * as path from "path";

export const configFile = "toolConf.json";
export const confPath = path.join(os.homedir(),configFile) 
export const npmrcPath =path.join(os.homedir(),'.npmrc')  
export const pipPath =path.join(os.homedir(),'pip','pip.ini')  
