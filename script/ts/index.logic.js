import { MessageLoader } from "./api/loader/message.loader.js";
import { DateFormatter } from "./lib/assistance/DateFormatter.js";
import { IndicatorMessageElement } from "./ui/indicator/IndicatorMessageElement.js";
export class IndexLogic {
    async DisplayLoading() {
        this.messagesEl.innerHTML = "";
        this.messagesEl.innerHTML = '<div class="loading-indicator">Loading...</div>';
        setTimeout(() => {
            this.LoadData();
            this.UpdateDisplay();
        }, 1000);
        return;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
            const response = await fetch('https://render-cli.datanet.live', {
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
            // if (error.name === 'AbortError') {
            //     statusText.innerText = "خطا: زمان ۱۰ ثانیه به پایان رسید و سرور پاسخ نداد.";
            // } else {
            //     statusText.innerText = "خطا در اتصال به سرور.";
            // }
            // handleError();
        }
        // fetch("").then(g => g.text()).then(g => {
        // })
    }
    messagesEl;
    UpdateDisplay() {
    }
    LoadData() {
        this.messagesEl.innerHTML = "";
        const dataloader = new MessageLoader();
        dataloader.OnLoadComplete = (g) => {
            var dta = JSON.parse(g);
            dta.forEach(msg => this.RenderMessage(msg));
            // this.addMessage(g, 'other');
            //this.DisplayData();
        };
        dataloader.Load();
    }
    DisplayData() {
    }
    //         echo "<div class='message' data-sender='".htmlspecialchars($msg['from'])."'>";
    //         echo "<p>" . htmlspecialchars($msg['text']) . "</p>";
    //         echo "<small>" . htmlspecialchars($msg['time']) . "</small>";
    //         echo "</div>";
    RenderMessage(item) {
        const msg = document.createElement('div');
        msg.className = `message ${item.info.from === 'user' ? 'user' : 'other'}`;
        msg.dataset.sender = item.info.from;
        const p = document.createElement('p');
        p.innerText = item.c;
        const small = document.createElement('small');
        small.innerText = item.info.timestamp;
        msg.appendChild(p);
        msg.appendChild(small);
        this.messagesEl.appendChild(msg);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        this.MessageOptimization(this.messagesEl);
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
        fetch(new MessageLoader().ServerUrl, {
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
