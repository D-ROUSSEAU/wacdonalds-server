const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { default: mongoose } = require("mongoose")
const Orders = require("../models/order.model")
const Orders_items = require("../models/order_item.model")
const app = require('../app')

jest.mock('../middlewares/auth', () => {
    return jest.fn((role) => (req, res, next) => {
        req.user = { userId: '691c3acbac9a25d133316b5c', role: mockedRole || role }
        next()
    })
})

let mongoServer

beforeAll(async() => {
    await mongoose.disconnect()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async() => {
    await mongoose.disconnect()
    await mongoServer.stop({ doCleanup: true });
})

describe("GET /api/orders as PREPARER", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner la liste des commandes", async () => {
        mockedRole = "preparer"

        const fakeOrders = [
            { name: "Order 1", items: [], status: "prepared" },
            { name: "Order 2", items: [], status: "prepared" },
        ]

        Orders.find = jest.fn().mockResolvedValue(fakeOrders)

        const res = await request(app).get("/api/orders")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeOrders)
        expect(Orders.find).toHaveBeenCalledTimes(1)
        expect(Orders.find).toHaveBeenCalledWith({ status: "prepared" })
    })

    it("devrait retourner une erreur 500", async () => {
        Orders.find.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get("/api/orders") 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the orders" }) 
    
    })
})

describe("GET /api/orders as ADMIN", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner la liste des commandes", async () => {
        mockedRole = "admin"

        const fakeOrders = [
            { name: "Order 1", items: [], status: "finished" },
            { name: "Order 2", items: [], status: "delivered" },
            { name: "Order 3", items: [], status: "" }
        ]

        Orders.find = jest.fn().mockResolvedValue(fakeOrders)

        const res = await request(app).get("/api/orders")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeOrders)
        expect(Orders.find).toHaveBeenCalledTimes(1)
        expect(Orders.find).toHaveBeenCalledWith({status: { $in: ["finished", "delivered", ""] }})
    })

    it("devrait retourner une erreur 500", async () => {
        Orders.find.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get("/api/orders") 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the orders" }) 
    
    })
})

describe("GET /api/orders/:id", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner la commande", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = [
            { _id: fakeId, name: "Order 1", items: [], status: "" },
        ]

        Orders.findById = jest.fn().mockResolvedValue(fakeOrder)

        const res = await request(app).get(`/api/orders/${fakeId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeOrder)
        expect(Orders.findById).toHaveBeenCalledTimes(1)
        expect(Orders.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const falseId = "1"

        const fakeOrder = [
            {_id: falseId, name: "Order 1", items: [] },
        ]

        Orders.findById = jest.fn().mockResolvedValue(fakeOrder)
        
        const res = await request(app).get(`/api/orders/${falseId}`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Orders.findById.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get(`/api/orders/${fakeId}`) 
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while fetching the order" }) 
    
    })
})

describe("POST /api/orders", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait créer une commande", async () => {
        const fakeMenu = {
            _id: new mongoose.Types.ObjectId().toString(),
            price: 12.99
        }

        const fakeItem = {
            _id: new mongoose.Types.ObjectId().toString(),
            price: 9.99
        }

        const fakeOrderItemId1 = new mongoose.Types.ObjectId().toString()
        const fakeOrderItemId2 = new mongoose.Types.ObjectId().toString()
        const fakeOrderId = new mongoose.Types.ObjectId().toString()
        let saveCall = 0
        
        Orders_items.prototype.save = jest.fn().mockImplementation(() => {
            saveCall++
            return Promise.resolve({
                _id: saveCall === 1 ? fakeOrderItemId1 : fakeOrderItemId2
            })
        })

        Orders.prototype.save = jest.fn().mockResolvedValue({
            _id: fakeOrderId,
            items: [fakeOrderItemId1, fakeOrderItemId2]
        })

        const res = await request(app)
            .post("/api/orders")
            .send({
                menus: [fakeMenu],
                items: [fakeItem]
            })

        expect(res.status).toBe(200)
        expect(res.body._id).toBe(fakeOrderId)
        expect(res.body.items).toEqual([fakeOrderItemId1, fakeOrderItemId2])
        expect(Orders_items.prototype.save).toHaveBeenCalledTimes(2)
        expect(Orders.prototype.save).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const res = await request(app).post("/api/orders").send({})
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "Please fill in the required fields" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeMenu = {
            _id: new mongoose.Types.ObjectId().toString(),
            price: 12.99
        }

        const fakeItem = {
            _id: new mongoose.Types.ObjectId().toString(),
            price: 9.99
        }

        Orders.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"))
        
        const res = await request(app)
            .post("/api/orders")
            .send({
                menus: [fakeMenu],
                items: [fakeItem]
            })
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while create the order" })
    })
})

describe("PUT /api/orders/:id/finish", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait terminer la commande", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "",
                save: jest.fn().mockResolvedValue({
                    _id: fakeId, name: "Order 1", items: [], status: "finished"
            })
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeOrder)

        const res = await request(app).put(`/api/orders/${fakeId}/finish`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ _id: fakeId, name: "Order 1", items: [], status: "finished" })
        expect(Orders.findById).toHaveBeenCalledTimes(1)
        expect(Orders.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = "1"

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/finish`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "", save: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/finish`)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while finishing the order" })
    
    })
})

describe("PUT /api/orders/:id/prepare", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait preparer la commande", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "",
                save: jest.fn().mockResolvedValue({
                    _id: fakeId, name: "Order 1", items: [], status: "prepared"
            })
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeOrder)

        const res = await request(app).put(`/api/orders/${fakeId}/prepare`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ _id: fakeId, name: "Order 1", items: [], status: "prepared" })
        expect(Orders.findById).toHaveBeenCalledTimes(1)
        expect(Orders.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = "1"

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/prepare`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "", save: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/prepare`)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while preparing the order" })
    
    })
})

describe("PUT /api/orders/:id/deliver", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait preparer la commande", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "",
                save: jest.fn().mockResolvedValue({
                    _id: fakeId, name: "Order 1", items: [], status: "delivred"
            })
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeOrder)

        const res = await request(app).put(`/api/orders/${fakeId}/deliver`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ _id: fakeId, name: "Order 1", items: [], status: "delivred" })
        expect(Orders.findById).toHaveBeenCalledTimes(1)
        expect(Orders.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = "1"

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/deliver`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeOrder = { 
            _id: fakeId, name: "Order 1", items: [], status: "", save: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Orders.findById = jest.fn().mockResolvedValue(fakeId)
        
        const res = await request(app).put(`/api/orders/${fakeId}/deliver`)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while delivering the order" })
    
    })
})