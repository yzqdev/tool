import { rcFile } from "rc-config-loader";

export function getToolrc() {
  let rcFileName = "tool";
  try {
    const results = rcFile(rcFileName);

    console.log(process.cwd());
    // Not Found
    if (!results) {
      return {};
    }
    return results.config;
  } catch (error) {
    // Found it, but it is parsing error
    return {}; // default value
  }
}
