export class ApplicationLoaderClass {
    AddLine() {
        var hr = document.createElement("hr");
        hr.classList.add("grow-animation");
        this.Container.append(hr);
    }
    AddMediaCard(isRevese, header, content, arg3) {
        var card = document.createElement("div");
        card.classList.add("media-card");
        var a = document.createElement("section");
        var b = document.createElement("section");
        b.classList.add("content");
        a.classList.add("preloader");
        var h2 = document.createElement("h2");
        h2.textContent = header;
        b.append(h2);
        var p = document.createElement("p");
        p.textContent = content;
        b.append(p);
        setTimeout(() => {
            var img = document.createElement("img");
            img.src = "assets/images/" + arg3;
            img.alt = header;
            a.append(img);
            a.classList.remove("preloader");
        }, 2000);
        if (isRevese) {
            card.append(b);
            card.append(a);
        }
        else {
            card.append(a);
            card.append(b);
        }
        this.Container.append(card);
    }
    Container;
    AddTitle(lvl, text) {
        var t = document.createElement("h" + lvl);
        t.classList.add("animated-intro");
        t.style.textAlign = "center";
        t.append(document.createTextNode(text));
        this.Container.append(t);
    }
}
export class IndexLogic {
    LoadData(currentUserName = "") {
        this.messagesEl.innerHTML = "Successfully Connected To Server";
        window.location.href = "/pages/contact-list/index.html";
    }
    UpdateDisplay() {
    }
    messagesEl;
    ConnectTry = 0;
    async DisplayLoading(currentUserName) {
        this.messagesEl.innerHTML = "";
        this.messagesEl.innerHTML = '<div class="loading-indicator">Loading...</div>';
        this.StartInitializer(this.ConnectTry);
        // setTimeout(() => {
        //     this.LoadData(currentUserName);
        //     this.UpdateDisplay();
        // }, 1000);
        // return;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
            let testlink = 'https://render-cli.datanet.live';
            //   testlink = `http://localhost:${3000}/test`;
            const response = await fetch(testlink, {
                signal: controller.signal // متصل کردن سیگنال قطع‌کننده به فچ
            });
            clearTimeout(timeoutId); // اگر زودتر جواب گرفتیم، تایمر ۱۰ ثانیه را ابطال کن
            //  const data = await response.json();
            this.LoadData();
            this.UpdateDisplay();
            //  statusText.innerText = "پاسخ دریافت شد!";
            //  loader.classList.add('hidden');
            //  console.log("Server Response:", data);
        }
        catch (error) {
            if (error.name === 'AbortError') {
                this.messagesEl.innerHTML = `<div class="preloader red-mode">Initializing ${this.ConnectTry}/3 </div>`;
                this.ConnectTry++;
                if (this.ConnectTry < 4) {
                    setTimeout(() => {
                        this.DisplayLoading(currentUserName);
                    }, 7000 + (4 - this.ConnectTry) * 1000);
                }
                else {
                    this.messagesEl.innerHTML = "";
                    var m = document.createElement("div");
                    m.classList.add("retry-dialog");
                    m.append(document.createTextNode("Unable to Connect To Server"));
                    var x = document.createElement("button");
                    x.classList.add("retry-btn");
                    x.innerHTML = "Retry";
                    m.append(x);
                    this.messagesEl.append(m);
                    x.onclick = () => {
                        top.location.reload();
                    };
                }
            }
            else {
                this.messagesEl.innerHTML = "";
            }
            // handleError();
        }
        // fetch("").then(g => g.text()).then(g => {
        // })
    }
    StartInitializer(ConnectTry) {
        if (ConnectTry < this.InitStep.length)
            this.InitStep[ConnectTry]();
    }
    InitStep = [];
}
var loader = new ApplicationLoaderClass();
loader.Container = document.querySelector("dialog-container");
var ac = document.querySelector("action-container");
var splash = new IndexLogic();
splash.messagesEl = ac;
splash.InitStep.push(() => {
    var header = new ApplicationLoaderClass();
    header.Container = document.querySelector("header-container");
    header.AddTitle(1, "Welcome");
    setTimeout(() => {
        header.AddLine();
    }, 1000);
});
splash.InitStep.push(() => {
    loader.AddMediaCard(false, "Fast and light", "This is a simple chat application built with modern web technologies.", "welcome.png");
});
splash.InitStep.push(() => {
    loader.AddMediaCard(true, "Safe and secure", "Your messages are encrypted and secure.", "secure.png");
});
splash.InitStep.push(() => {
    loader.AddMediaCard(false, "Customizable", "Easily customize your chat experience with themes and settings.", "customizable.png");
});
splash.DisplayLoading("");
