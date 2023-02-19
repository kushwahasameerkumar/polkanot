const grpc = require("@grpc/grpc-js");
const express = require('express')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const path = require('path')
const cors = require('cors')

const protos = require('./protos')

const app = express()

// session configuration
const hour = 1000 * 60 * 60;
app.use(sessions({
    // TODO: Move this to env
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 2 * hour },
    resave: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// TODO: move list of origin to config file
app.use(cors({credentials:true, origin: 'http://localhost:3001'}))

// for serving client production build
app.use(express.static(path.join(__dirname, "build/client")))

// TODO: move db service endpoint to config file
const db = new protos.db.Database(process.env.DB_UTILITY_SERVICE_URL, grpc.credentials.createInsecure())

// middleware to authenticate secured resources
async function isAuthenticated(req, res, next) {
    const address = req.session.address
    if(address) {
        db.IsSubscriber({ address }, (err, response) => {
            if(err || response?.isError) {
                res.status(500).send(err ? null : response?.message)
                return
            }

            if(response.isFound) {
                next()
                return
            }

            res.status(403).send("Forbidden. Sign in first!")
        })
    } else {
        res.status(403).send("Forbidden. Sign in first!")
    }
}

// registering/logging in address
app.post("/auth", async (req, res) => {
    const { address, signature, token } = req.body

    db.AuthenticateAddress({ address, signature, token }, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }
    
        req.session.address = address
        res.status(200).send("Successful!")
    })
});

// get subscriber info
app.get('/get-subscriber-info', isAuthenticated, async (req, res) => {
    db.GetSubscriberInfo({ address: req.session.address }, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }

        res.status(200).send(response)
    })
})

// list all channels
app.get('/get-channels', isAuthenticated, async (req, res) => {
    db.GetAllChannels({}, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }

        res.status(200).send(response)
    })
})

// fetch last unread notifications
app.get('/get-notifications', isAuthenticated, async (req, res) => {
    const { channelId, token } = req.query
    db.GetNotifications({ address: req.session.address, channelId, token}, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }

        res.status(200).send(response)
    })
})

// subscribe new channel
app.post("/subscribe-channel", isAuthenticated, async (req, res) => {
    const { channelId } = req.body
    db.SubscribeChannel({ address: req.session.address, channelId }, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }

        res.status(200).send(response)
    })
})

// add new webhook
app.post("/add-webhook", isAuthenticated, async (req, res) => {
    const { channelId } = req.body
    let {endpoint} = req.body

    if(endpoint){
        try {
            const providedUrl = new URL(endpoint);
        }catch(err){
            return res.status(400).send('Provided endpoint is not a correct URL format')
        }
    }

    db.AddNewWebhook({ address: req.session.address, channelId, endpoint }, (err, response) => {
        if(err || response?.isError) {
            res.status(500).send(err ? null : response?.message)
            return
        }

        res.status(200).send(response)
    })
})

// Miscellaneous
app.get('/health', (req, res) => {
    res.status(200).send('Server healthy')
})

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, "build/client", "index.html"))
})

app.listen(process.env.PORT || 6000, () => {
    console.log(`Server started at port ${process.env.PORT || 6000}`)
})
