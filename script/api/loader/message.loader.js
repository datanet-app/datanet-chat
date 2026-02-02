export class MessageLoader {
    OnLoadstring;
    Load() {
        fetch("https://datanet-chat-api.onrender.com/fetch-data").then(g => g.text()).then(g => {
            if (g.startsWith("{")) {
                return;
            }
            if (this.OnLoadstring)
                this.OnLoadstring(g);
        });
    }
}
