import { MessageLoader } from "./api/loader/message.loader.js";
import { MessageRenderer } from "./lib/gen/MessageRenderer.js";
import { IndicatorMessageElement } from "./ui/indicator/IndicatorMessageElement.js";
export class IndexLogic {
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
