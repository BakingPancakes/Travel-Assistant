/**
 * Usage: { sender, timestamp, text, name }
 * timestamp format: {time}, {month} {day}
 */
export class Message{
    constructor(data = {}) {
        this.sender = data.sender;
        this.timestamp = data.timestamp;
        this.text = data.text;
        this.name = data.name;
    }
}