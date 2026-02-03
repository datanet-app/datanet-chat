import { MessageLoader } from "./api/loader/message.loader.js";
import { DateFormatter } from "./lib/assistance/DateFormatter.js";
import { IndicatorMessageElement } from "./ui/indicator/IndicatorMessageElement.js";
import { MessageRenderer } from "./lib/gen/MessageRenderer.js";
export class IndexLogic {
    ConnectTry = 1;
    async DisplayLoading(currentUserName) {
        this.messagesEl.innerHTML = "";
        this.messagesEl.innerHTML = '<div class="loading-indicator">Connecting...</div>';
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
                    setTimeout(() => this.DisplayLoading(currentUserName), 7000 + (4 - this.ConnectTry) * 1000);
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
    messagesEl;
    UpdateDisplay() {
    }
    LoadData(currentUserName = "") {
        this.messagesEl.innerHTML = "";
        const dataloader = new MessageLoader();
        dataloader.OnLoadComplete = (g) => {
            var dta = JSON.parse(g);
            var Renderer = new MessageRenderer();
            dta.forEach(msg => {
                console.log(currentUserName, msg.info.from);
                Renderer.RenderMessage(this.messagesEl, msg, currentUserName === msg.info.from);
            });
            // this.addMessage(g, 'other');
            //this.DisplayData();
        };
        dataloader.Load();
    }
    DisplayData() {
    }
    //>> Post Message
    PostMessage(inputEl, txtSenderName) {
        const message = inputEl.value.trim();
        if (!message)
            return;
        var indicator = new IndicatorMessageElement(message, 'user', { state: "sending", active: true });
        inputEl.value = '';
        this.messagesEl.appendChild(indicator.el);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        const formData = new FormData();
        formData.append('message', message);
        formData.append('sender', txtSenderName.innerText);
        fetch(new MessageLoader().ServerUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(resText => {
            var result = JSON.parse(resText);
            if (result.status === 'success') {
                indicator.DisplayState("success", false, 1000);
                // this.LoadData(); // بارگذاری پیام‌ها بعد از ارسال
                // document.getElementById('message').value = ''; // پاک کردن ورودی پیام
            }
            else {
                indicator.UpdateState("failed", false);
                alert(result.message);
            }
        })
            .catch(error => {
            indicator.UpdateState("failed", false);
            console.error('Error:', error);
        });
    }
}
