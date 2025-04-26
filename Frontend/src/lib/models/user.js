export class User {
    constructor(data = {}) {
        //TODO: Default values
        this.id = data.id;
        this.name = data.name;
        this.trip_perms = data.trip_perms;
        this.chat_perms = data.chat_perms;
        // this.img = data.img;
    }
}