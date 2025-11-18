const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { default: mongoose } = require("mongoose")
const Menus = require("../models/menu.model")
const app = require('../app')

jest.mock('../middlewares/auth', () => {
    return jest.fn((role) => (req, res, next) => {
        req.user = { userId: '691c3acbac9a25d133316b5c', role }
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

describe("GET /api/menus", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner la liste des menus", async () => {
        const fakeMenus = [
            { name: "Menu 1", products: [] },
            { name: "Menu 2", products: [] },
        ]

        Menus.find = jest.fn().mockResolvedValue(fakeMenus)

        const res = await request(app).get("/api/menus")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeMenus)
        expect(Menus.find).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 500", async () => {
        Menus.find.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get("/api/menus") 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the menus" }) 
    
    })
})

describe("GET /api/menus/:id", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner le menu", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeMenu = [
            {_id: fakeId, name: "Menu 1", products: [] },
        ]

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)

        const res = await request(app).get(`/api/menus/${fakeId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeMenu)
        expect(Menus.findById).toHaveBeenCalledTimes(1)
        expect(Menus.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const falseId = "1"

        const fakeMenu = [
            {_id: falseId, name: "Menu 1", products: [] },
        ]

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)
        
        const res = await request(app).get(`/api/menus/${falseId}`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" }) 
    
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Menus.findById.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get(`/api/menus/${fakeId}`) 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the menu" }) 
    
    })
})

describe("POST /api/menus", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait créer un menu", async () => {
        const fakeMenu = { name: "Menu 1", description: "Description", products: [] }

        Menus.prototype.save = jest.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId().toString(),
            ...fakeMenu
        })

        const res = await request(app)
            .post("/api/menus")
            .send(fakeMenu)

        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe(fakeMenu.name)
        expect(res.body.description).toBe(fakeMenu.description)
        expect(res.body.products).toEqual(fakeMenu.products)
        expect(Menus.prototype.save).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeMenu = {}

        Menus.prototype.save = jest.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId().toString(),
            ...fakeMenu
        })
        
        const res = await request(app)
            .post("/api/menus")
            .send(fakeMenu)
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "Please fill in the required fields" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeMenu = { name: "Menu 1", description: "Description", products: [] }

        Menus.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"))
        
        const res = await request(app)
            .post("/api/menus")
            .send(fakeMenu)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while create the menu" })
    
    })
})

describe("PUT /api/menus/:id", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait modifier un menu", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeMenu = {
            _id: fakeId,
            name: "Menu 1",
            description: "Description",
            products: [],
            save: jest.fn().mockResolvedValue({
                _id: fakeId,
                name: "Menu 1 changed",
                description: "Description changed",
                products: [
                    "1"
                ]
            })
        }

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)

        const res = await request(app)
            .put(`/api/menus/${fakeId}`)
            .send({ name: "Menu 1 changed", description: "Description changed", products: ["1"] })

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            _id: fakeId,
            name: "Menu 1 changed",
            description: "Description changed",
            products: ["1"]
        })
        expect(fakeMenu.save).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Menus.findById = jest.fn().mockResolvedValue(null) // pas de menu

        const res = await request(app)
            .put(`/api/menus/${fakeId}`)
            .send({ name: "Menu 1", description: "Description", products: [] })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Menu not find" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeMenu = {
            _id: fakeId,
            name: "Menu 1",
            description: "Description",
            products: [],
            save: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Menus.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"))

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)
        
        const res = await request(app)
            .put(`/api/menus/${fakeId}`)
            .send({ name: "Menu 1", description: "Description", products: [] })
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while edit the menu" })
    
    })
})

describe("DELETE /api/menus", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait supprimer le menu", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeMenu = {
            _id: fakeId,
            name: "Menu 1",
            products: [],
            deleteOne: jest.fn().mockResolvedValue({})
        }

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)
        
        const res = await request(app).delete(`/api/menus/${fakeId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Menu deleted" })
        expect(fakeMenu.deleteOne).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Menus.findById = jest.fn().mockResolvedValue(null) // pas de menu

        const res = await request(app).delete(`/api/menus/${fakeId}`)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Menu not find" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeMenu = {
            _id: fakeId,
            name: "Menu 1",
            description: "Description",
            products: [],
            deleteOne: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Menus.findById = jest.fn().mockResolvedValue(fakeMenu)
        
        const res = await request(app).delete(`/api/menus/${fakeId}`)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while delete the menu" })
    
    })
})