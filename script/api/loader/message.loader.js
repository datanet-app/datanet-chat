export class MessageLoader {
    OnLoadComplete;
    ServerUrl;
    constructor() {
        this.ServerUrl = "https://render-cli.datanet.live/fetch-data";
        this.ServerUrl = "http://localhost:8000";
    }
    Load() {
        fetch(this.ServerUrl).then(g => g.text()).then(g => {
            if (this.OnLoadComplete)
                this.OnLoadComplete(g);
        });
    }
    Send() {
    }
}
