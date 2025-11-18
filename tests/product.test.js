const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { default: mongoose } = require("mongoose")
const Products = require("../models/product.model")
const app = require('../app')

jest.mock('../middlewares/auth', () => {
    return jest.fn((role) => (req, res, next) => {
        req.user = { userId: '691c3acbac9a25d133316b5c', role }
        next()
    })
})

jest.mock('../middlewares/multer', () => ({
    single: () => (req, res, next) => {
        req.file = { filename: "image.png" }
        next()
    }
}))

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

describe("GET /api/products", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
  
    it("devrait retourner la liste des produits", async () => {
        const fakeProductss = [
            { name: "Product 1" },
            { name: "Product 2" },
        ]

        Products.find = jest.fn().mockResolvedValue(fakeProductss)

        const res = await request(app).get("/api/products")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeProductss)
        expect(Products.find).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 500", async () => {
        Products.find.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get("/api/products") 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the products" }) 
    
    })
})

describe("GET /api/menus/:id", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner le produit", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeProduct = [
            {_id: fakeId, name: "Produit 1" },
        ]

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)

        const res = await request(app).get(`/api/products/${fakeId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeProduct)
        expect(Products.findById).toHaveBeenCalledTimes(1)
        expect(Products.findById).toHaveBeenCalledWith(fakeId)
    })

    it("devrait retourner une erreur 400", async () => {
        const falseId = "1"

        const fakeProduct = [
            {_id: falseId, name: "Product 1" },
        ]

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)
        
        const res = await request(app).get(`/api/products/${falseId}`) 
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "ID not valid" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Products.findById.mockRejectedValue(new Error("Database error")) 
        
        const res = await request(app).get(`/api/products/${fakeId}`) 
        
        expect(res.statusCode).toBe(500) 
        expect(res.body).toEqual({ error: "An error occurred while fetching the product" }) 
    })
})

describe("POST /api/products", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait créer un produit", async () => {
        const fakeProduct = { name: "Product 1", description: "Description", price: 9.99, image: "image.png", quantity: 100 }

        Products.prototype.save = jest.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId().toString(),
            ...fakeProduct
        })

        const res = await request(app)
            .post("/api/products")
            .send({ name: "Product 1", description: "Description", price: 9.99, quantity: 100 })

        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe(fakeProduct.name)
        expect(res.body.description).toBe(fakeProduct.description)
        expect(res.body.price).toEqual(fakeProduct.price)
        expect(res.body.image).toEqual(fakeProduct.image)
        expect(res.body.quantity).toEqual(fakeProduct.quantity)
        expect(Products.prototype.save).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeProduct = {}

        Products.prototype.save = jest.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId().toString(),
            ...fakeProduct
        })
        
        const res = await request(app)
            .post("/api/products")
            .send(fakeProduct)
        
        expect(res.statusCode).toBe(400) 
        expect(res.body).toEqual({ error: "Please fill in the required fields" }) 
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeProduct = { name: "Product 1", description: "Description", price: 9.99, image: null, quantity: 100 }

        Products.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"))
        
        const res = await request(app)
            .post("/api/products")
            .send(fakeProduct)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while create the product" })
    
    })
})

describe("PUT /api/products/:id", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait modifier un produit", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeProduct = {
            _id: fakeId,
            name: "Product 1",
            description: "Description",
            price: 9.99,
            image: null,
            quantity: 100,
            save: jest.fn().mockResolvedValue({
                _id: fakeId,
                name: "Product 1",
                description: "Description",
                price: 9.99,
                image: "image.png",
                quantity: 100
            })
        }

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)

        const res = await request(app)
            .put(`/api/products/${fakeId}`)
            .send({ name: "Product 1", description: "Description", price: 9.99, quantity: 100 })

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            _id: fakeId,
            name: "Product 1",
            description: "Description",
            price: 9.99,
            image: "image.png",
            quantity: 100,
        })
        expect(fakeProduct.save).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Products.findById = jest.fn().mockResolvedValue(null) // pas de menu

        const res = await request(app)
            .put(`/api/products/${fakeId}`)
            .send({ name: "Product 1", description: "Description", price: 9.99, image: null, quantity: 100 })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Product not find" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeProduct = {
            _id: fakeId,
            name: "Product 1",
            description: "Description",
            price: 9.99,
            image: null,
            quantity: 100,
            save: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Products.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"))

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)
        
        const res = await request(app)
            .put(`/api/products/${fakeId}`)
            .send({ name: "Product 1", description: "Description", price: 9.99, image: null, quantity: 100 })
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while edit the product" })
    
    })
})

describe("DELETE /api/menus", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait supprimer le produit", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeProduct = {
            _id: fakeId,
            name: "Product 1",
            description: "Description",
            price: 9.99,
            image: null,
            quantity: 100,
            deleteOne: jest.fn().mockResolvedValue({})
        }

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)
        
        const res = await request(app).delete(`/api/products/${fakeId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Product deleted" })
        expect(fakeProduct.deleteOne).toHaveBeenCalledTimes(1)
    })

    it("devrait retourner une erreur 400", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        Products.findById = jest.fn().mockResolvedValue(null) // pas de menu

        const res = await request(app).delete(`/api/products/${fakeId}`)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Product not find" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()
        const fakeProduct = {
            _id: fakeId,
            name: "Product 1",
            description: "Description",
            price: 9.99,
            image: null,
            quantity: 100,
            deleteOne: jest.fn().mockRejectedValue(new Error("Database error"))
        }

        Products.findById = jest.fn().mockResolvedValue(fakeProduct)
        
        const res = await request(app).delete(`/api/products/${fakeId}`)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "An error occurred while delete the product" })
    
    })
})