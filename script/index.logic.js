import { MessageLoader } from "./api/loader/message.loader.js";
import { DateFormatter } from "./lib/assistance/DateFormatter.js";
import { IndicatorMessageElement } from "./ui/indicator/IndicatorMessageElement.js";
export class IndexLogic {
    messagesEl;
    UpdateDisplay() {
    }
    LoadData() {
        this.messagesEl.innerHTML = "";
        const dataloader = new MessageLoader();
        dataloader.Load();
        dataloader.OnLoadstring = (g) => {
            this.addMessage(g, 'other');
            this.DisplayData();
        };
    }
    DisplayData() {
    }
    addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = text;
        this.messagesEl.appendChild(msg);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        this.MessageOptimization(this.messagesEl);
    }
    MessageOptimization(el) {
        const messagesList = el.querySelectorAll('.message');
        //>> Optimize Visuals
        for (let i = 0; i < messagesList.length - 1; i++) {
            const current = messagesList[i];
            const next = messagesList[i + 1];
            const sender1 = current.dataset.sender;
            const sender2 = next.dataset.sender;
            if (sender1 !== sender2)
                continue;
            const snall1 = current.querySelector('small');
            const snall2 = next.querySelector('small');
            if (!snall1 || !snall2)
                continue;
            const time1 = new Date(snall1.textContent);
            const time2 = new Date(snall2.textContent);
            const diffMinutes = (time2.getTime() - time1.getTime()) / (1000 * 60);
            if (diffMinutes <= 10) {
                if (current.classList.contains('merge-up')) {
                    current.classList.add('merge-middle');
                }
                else
                    current.classList.add('merge-down');
                next.classList.add('merge-up');
            }
        }
        //>> Format Dates
        const formatter = new DateFormatter();
        el.querySelectorAll("small").forEach(small => {
            const originalDate = small.textContent;
            console.log(originalDate);
            small.textContent = formatter.formatDate(originalDate);
        });
        //>> Display Compact Mode
        const range = document.createRange();
        messagesList.forEach(message => {
            var pTag = message.querySelector("p");
            if (!pTag)
                return;
            range.selectNodeContents(pTag);
            const contentWidth = range.getBoundingClientRect().width;
            if (contentWidth < 200) {
                message.classList.add('compact-mode');
            }
        });
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
        fetch("https://render-cli.datanet.live/fetch-data", {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(resText => {
            console.log("resText", resText);
            const jsonPart = resText.split("<")[0];
            var result = JSON.parse(jsonPart);
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
        // شبیه‌سازی پاسخ طرف مقابل
        // setTimeout(() => {
        //     addMessage('Sample Response 🤖', 'other');
        // }, 800);
    }
}
