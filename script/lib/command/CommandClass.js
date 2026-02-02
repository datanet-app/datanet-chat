import { CommandRoute } from "./CommandRoute.js";
export class CommandClass {
    Handler;
    run(el) {
        var cmd = new CommandRoute();
        cmd.param = "";
        if (el.dataset.command) {
            cmd.url = el.dataset.command;
            cmd.param = el.dataset.param !== undefined ? el.dataset.param : "";
            if (cmd.param == "" && el.dataset.uid !== undefined)
                cmd.param = el.dataset.uid;
        }
        if (el.dataset.action) {
            cmd.url = el.dataset.action;
        }
        if (this.Handler)
            this.Handler(cmd);
    }
}
