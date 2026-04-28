const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const dns = require("dns");
const crypto = require("crypto");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const admin = require("firebase-admin");

const serviceAccount = require("./zap-shift-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const generateTrackingId = () => {
  const prefix = "IMTI";
  const date = new Date().toDateString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `${prefix}-${date}-${random}`;
};

// Middleware
app.use(express.json());
app.use(cors());

const verifyFireBaseToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  try {
    const idToken = token.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.decoded_email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
};

const stripe = require("stripe")(process.env.STRIPE_SECRET);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ab3rgue.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("zap_shift_db");
    const userCollections = db.collection("users");
    const parcelsCollections = db.collection("parcels");
    const paymentCollections = db.collection("payments");
    const ridersCollections = db.collection("riders");

    // MiddleWare with database
    const verifyAdminToken = async (req, res, next) => {
      const email = req.decoded_email;
      const query = { email };

      const user = await userCollections.findOne(query);

      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "Forbidden Access" });
      }

      next();
    };

    // Users
    app.get("/users", verifyFireBaseToken, async (req, res) => {
      const searchText = req.query.searchText;
      const query = {};
      if (searchText) {
        // query.displayName = { $regex: searchText, $options: "i" }; this a system which is use to find by name only
        query.$or = [
          { displayName: { $regex: searchText, $options: "i" } },
          { email: { $regex: searchText, $options: "i" } },
        ];
      }

      const cursor = userCollections
        .find(query)
        .limit(5)
        .sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      ((user.role = "user"), (user.createdAt = new Date()));

      const userExist = await userCollections.findOne({ email: user.email });
      if (userExist) {
        return res.send({ message: "User exist" });
      }

      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    app.patch(
      "/users/:id/role",
      verifyFireBaseToken,
      verifyAdminToken,
      async (req, res) => {
        const id = req.params.id;
        const role = req.body.role;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: role,
          },
        };

        const result = await userCollections.updateOne(query, updatedDoc);
        res.send(result);
      },
    );

    app.get("/user/:id", async (req, res) => {});

    app.get("/users/:email/role", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollections.findOne(query);
      res.send({ role: user?.role || "user" });
    });

    app.get("/parcels", async (req, res) => {
      const query = {};
      const { email } = req.query;
      if (email) {
        query.senderEmail = email;
      }

      const options = { sort: { createdAt: -1 } };
      const cursor = parcelsCollections.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parcelsCollections.findOne(query);
      res.send(result);
    });

    app.post("/parcels", async (req, res) => {
      const parcel = req.body;
      parcel.createdAt = new Date();
      const result = await parcelsCollections.insertOne(parcel);
      res.send(result);
    });

    app.delete("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parcelsCollections.deleteOne(query);
      res.send(result);
    });

    // payment APIS
    // Slightly Change but same jinish in differently
    app.post("/payment-checkout", async (req, res) => {
      const paymentInfo = req.body;
      const amount = parseInt(paymentInfo.cost) * 100;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount: amount,
              product_data: {
                name: `Please pay for ${paymentInfo.parcelName}!`,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          parcelId: paymentInfo.parcelId,
          deliveryStatus: "pending-pickup",
          parcelName: paymentInfo.parcelName,
        },
        customer_email: paymentInfo.senderEmail,
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
      });

      res.send({ url: session.url });
    });

    // Old
    app.post("/create-checkout-session", async (req, res) => {
      const paymentInfo = req.body;
      const amount = parseInt(paymentInfo.cost) * 100;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount: amount,
              product_data: {
                name: paymentInfo.parcelName,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: paymentInfo.senderEmail,
        mode: "payment",
        metadata: {
          parcelId: paymentInfo.parcelId,
        },
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
      });

      console.log(session.url);
      res.send({ url: session.url });
    });

    app.patch("/verify-payment", async (req, res) => {
      const sessionID = req.query.session_id;
      const session = await stripe.checkout.sessions.retrieve(sessionID);

      const transactionId = session.payment_intent;
      const query = { transactionId: transactionId };
      const paymentExist = await paymentCollections.findOne(query);
      if (paymentExist) {
        return res.send({
          message: "Already exist payment track",
          transactionId,
          trackingID: paymentExist.trackingID,
        });
      }

      const trackingID = generateTrackingId();
      if (session.payment_status == "paid") {
        const id = session.metadata.parcelId;
        const query = { _id: new ObjectId(id) };
        const update = {
          $set: {
            paymentStatus: "paid",
            trackingID: trackingID,
          },
        };
        const result = await parcelsCollections.updateOne(query, update);
        const paymentHistory = {
          amount: session.amount_total / 100,
          currency: session.currency,
          customer_email: session.customer_email,
          parcelId: session.metadata.parcelId,
          parcelName: session.metadata.parcelName,
          transactionId: session.payment_intent,
          paymentStatus: session.payment_status,
          paidAt: new Date(),
          trackingID: trackingID,
        };

        if (session.payment_status === "paid") {
          const resPay = await paymentCollections.insertOne(paymentHistory);
          res.send({
            success: true,
            modifyParcel: result,
            trackingID: trackingID,
            paymentInfo: resPay,
            transactionId: session.payment_intent,
          });
        }
      }

      res.send({ success: false });
    });

    //
    app.get("/payments", verifyFireBaseToken, async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.customer_email = email;

        // Check email address of user
        if (email !== req.decoded_email) {
          return res.status(403).send({ message: "Forbidden Access" });
        }
      }

      const cursor = paymentCollections.find(query).sort({ paidAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Riders Related API
    app.get("/riders", async (req, res) => {
      const query = {};
      if (req.query.status) {
        query.status = req.query.status;
      }

      const cursor = ridersCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/riders", async (req, res) => {
      const rider = req.body;
      ((rider.status = "pending"), (rider.createdAt = new Date()));
      const result = await ridersCollections.insertOne(rider);
      res.send(result);
    });

    app.patch("/riders/:id", verifyFireBaseToken, async (req, res) => {
      const status = req.body.status;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          status: status,
        },
      };

      const result = await ridersCollections.updateOne(query, updatedDoc);

      if (status === "approved") {
        const email = req.body.email;
        const userQuery = { email: email };
        const updateUser = {
          $set: {
            role: "rider",
          },
        };

        const userResult = await userCollections.updateOne(
          userQuery,
          updateUser,
        );
        console.log("User role update result:", userResult);
      }
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Zap is shifting and shifting!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
