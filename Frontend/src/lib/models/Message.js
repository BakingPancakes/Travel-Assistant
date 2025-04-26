export class Message{
    constructor(data = {}) {
        this.sender = data.sender;
        this.timestamp = data.timestamp;
        this.text = data.text;
        this.name = data.name;
    }
}