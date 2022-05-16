const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App Started");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://admin:admin@cluster0.2fq8k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("NotesTaker").collection("NotesData");
    console.log("DB Connected");

    //get - to read all notes
    //http://localhost:5000/notes

    app.get("/notes", async (req, res) => {
      const query = req.query;
      const cursor = await notesCollection.find(query);
      const result = await cursor.toArray();
      //   console.log(req.query);
      res.send(result);
    });

    // create - to create a note
    //http://localhost:5000/note
    app.post("/note", async (req, res) => {
      const data = req.body;
      const note = await notesCollection.insertOne(data);
      console.log(data);
      res.send(note);
    });

    //put - update note content
    // http://localhost:5000/note/628125063cf1b1aa39e64b43
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const data = req.body;

      const updateDoc = {
        $set: {
          name: data.name,
          note: data.note,
          // or req.body
          // or data
          // or ...data
        },
      };

      const result = await notesCollection.updateOne(filter, updateDoc, options);

      console.log(id);
      res.send(result);
    });

    // delete note
    // http://localhost:5000/note/628125063cf1b1aa39e64b43
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };

      const result = await notesCollection.deleteOne(filter);
      res.send(result);
      console.log("Deleted note with id :", id);
    });
  } finally {
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
