import { DateFormatter } from "../assistance/DateFormatter.js";
import { IndicatorMessageElement } from "../../ui/indicator/IndicatorMessageElement.js";
export class MessageRenderer {
    DTA;
    constructor() {
        this.DTA = new DateFormatter();
    }
    RenderTimeCaption(time) {
        const DTA = new DateFormatter();
        const TimeCaption = document.createElement('time');
        TimeCaption.dateTime = new Date(time).toString();
        TimeCaption.title = TimeCaption.dateTime;
        TimeCaption.dataset.ticks = time.toString();
        TimeCaption.textContent = DTA.GetDateFormat(time);
        return TimeCaption;
    }
    RenderMessage(messagesEl, item, isSelfMessage = false) {
        const msgEl = document.createElement('message-item');
        if (isSelfMessage) {
            msgEl.classList.add('self-message');
        }
        if (this.NeedAddCaption(item)) {
            if (isSelfMessage) {
                const MessageCaption = document.createElement('message-caption');
                MessageCaption.append(this.Span("You"));
                MessageCaption.append(this.TimeEl(this.DTA, item.info.time));
                msgEl.appendChild(MessageCaption);
            }
            else {
                //>> Sender Information
                const SenderInfo = document.createElement('message-senderinfo');
                SenderInfo.className = 'sender-info';
                SenderInfo.dataset.date = this.DTA.GetDateFormat(item.info.time);
                SenderInfo.append(this.Span(item.info.from));
                SenderInfo.append(this.TimeEl(this.DTA, item.info.time));
                msgEl.appendChild(SenderInfo);
            }
        }
        else
            msgEl.classList.add('no-caption');
        //>> Create Content
        const MessageContent = document.createElement('message-content');
        MessageContent.dir = "auto";
        const p = document.createElement('p');
        p.innerText = item.content;
        MessageContent.appendChild(p);
        //>> Init Element        
        msgEl.dataset.sender = item.info.from;
        msgEl.appendChild(MessageContent);
        messagesEl.appendChild(msgEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    TimeEl(DTA, time) {
        const TimeCaption = document.createElement('time');
        TimeCaption.dateTime = new Date(time).toString();
        TimeCaption.title = TimeCaption.dateTime;
        TimeCaption.dataset.ticks = time.toString();
        TimeCaption.textContent = DTA.GetDateFormat(time);
        return TimeCaption;
    }
    Span(Content) {
        const span = document.createElement('span');
        span.innerText = Content;
        return span;
    }
    CurrentItem = null;
    NeedAddCaption(item) {
        var ExItem = this.CurrentItem;
        this.CurrentItem = item;
        if (ExItem === null)
            return true;
        if (ExItem.info.from !== item.info.from)
            return true;
        const diffMinutes = this.DTA.GetDiffervenceInMinutes(item.info.time, ExItem.info.time);
        this.CurrentItem = item;
        if (diffMinutes < 10)
            return false;
        return true;
    }
}
