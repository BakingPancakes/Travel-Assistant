export class Chat {
    constructor(data = {}) {
        if (!(data["members"] || data["members"].length)) {
            throw new Error("Error initializing new Chat object: >= 1 members must be declared.");
        }
        if (!data["name"] === undefined) {
            throw new Error("Error initializing new Chat object. Name must be specified.");
        }
        if (!data["date"]) {
            throw new Error("Error initializing new Chat object. Date must be specified.")
        }
        // required:
        this.name = data.name;    
        this.members = data.members; 
        this.date = data.date;

        // optionl:
        this.id = data.id | Date.now();
        this.trip = data.trip || '';    
        this.messages = data.messages || Array(0);
    }
    /* Example:
    {
        id: {
            id: 99999999,
            name: 'name text',
            trip: 'trip name',
            members: ['JoonID', 'JasperID'],
            messages: [{
                    sender: 'from',
                    timestamp: '1:00PM, April 25',
                    text: 'Heyooo',
                    name: 'Jasper',
                },
                {
                    sender: 'to',
                    timestamp: '1:02PM, April 25',
                    text: 'Hey!',
                    name: 'Joon',
                }
            ]
        }
    }
        */
}