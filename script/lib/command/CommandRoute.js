export class CommandRoute {
    url;
    param;
    IsDone = false;
    On(url, param, RequestedAction) {
        if (this.IsDone)
            return;
        this.IsDone = (this.url === url && this.param === param);
        if (this.IsDone)
            RequestedAction();
    }
}
