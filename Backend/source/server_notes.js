/** The following are all examples from the slides
 
    Feel free to repurpose this, this is simply for my own notes.
*/
/** */
const app = express();
const PORT = process.env.PORT || 3000;

// Establishes path for middleware. Path can be string or pattern
const STATIC_PAGE_PATH = '';
app.use(express.static(STATIC_PAGE_PATH));

// Mount user routes
app.use('/users', userRoutes);

// =======================
// Establishing GET routes
// =======================

// ~~This formats the GET request associated with fetch("/html")~~
let count = 0;
app.get("/html", (req, res) => {
    const body = `
    <h1>Example HTML</h1>
    <p>This is a super cool example of an html response!</p>
    <p>It's also dynamic on subsequent requests:${++count}</p> 
    `;
    res.send(body);
});

// ~~This formats GET for fetch("/json"), so data can be grabbed dynamically!~~
app.get("/json", (req, res) => {
    const data = {name: "Zavier", friends: ["Joon", "Jasper"]};
    res.json(data);
});

// ~~Use parameters to grab specific data, such as: fetch("/trips/:[id here]")~~
//    Example usage: const trip = await fetch(`\trips\${trip_id}`);
// TODO: have to consider how we would store/access the ID's -> maybe fetch the user, then fetch trip based on info stored in user profile
//     I'll put this in a github issue!
const trips = [
    {id: '1', name: "Cancún", members: ["Zavier", "Joon", "Jasper"]}
];  
app.get("/trips/:trip_id", (req, res) => {
    const id = req.params.trip_id;
    const trip = trips.find(t => t.id === id);
    trip ? res.json(trip) :
    res.status(404).json({message: "Trip not found!"});
});

// Set up express server
app.listen(PORT, (error) => {
    if (error) console.log(`An error occured when trying to start the server: ${error}`);
    console.log(`Server has started running on http://localhost:${PORT}`);
});