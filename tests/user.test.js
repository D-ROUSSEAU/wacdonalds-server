const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { default: mongoose } = require("mongoose")
const Users = require("../models/user.model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = require('../app')

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

describe("POST /api/users/register", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait créer un utilisateur", async () => {
        const fakeUser = {
            email: "test@test.com",
            password: "Hashedpassword123",
        }

        const res = await request(app)
            .post("/api/users/register")
            .send(fakeUser)

        expect(res.statusCode).toBe(201)
        expect(res.body.email).toEqual(fakeUser.email)

        const isPasswordValid = await bcrypt.compare(fakeUser.password, res.body.password)

        expect(isPasswordValid).toBe(true)
    })

    it("devrait retourner une erreur 400 si email ou password manquant", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ email: "" })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Email and password are required" })
    })

    it("devrait retourner une erreur 400 si le mot de passe ne respecte pas les règles", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ email: "test@test.com", password: "abc" })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Password does not meet security criteria" })
    })

    it("devrait retourner une erreur 400 si l'utilisateur existe déjà", async () => {
        const fakeUser = {
            email: "test@test.com",
            password: "Hashedpassword123",
        }

        Users.findById = jest.fn().mockResolvedValue(fakeUser)

        const res = await request(app)
            .post("/api/users/register")
            .send(fakeUser)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "User already exists" })
    })

    it("devrait retourner une erreur 500", async () => {
        const fakeUser = {
            email: "test@test.com",
            password: "Hashedpassword123",
        }

        Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"))

        const res = await request(app)
            .post("/api/users/register")
            .send(fakeUser)

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "Error when trying to register user" })
    })
})


describe("POST /api/users/login", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner 200 et un token si identifiants valides", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString()

        const fakeUser = {
            _id: fakeId,
            email: "test@test.com",
            password: "Hashedpassword1234",
            role: "user"
        }

        Users.findOne = jest.fn().mockResolvedValue(fakeUser)
        bcrypt.compare = jest.fn().mockResolvedValue(true)
        jwt.sign = jest.fn().mockReturnValue("faketoken123")

        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@test.com", password: "Valid123" })

        expect(Users.findOne).toHaveBeenCalledWith({ email: "test@test.com" })
        expect(bcrypt.compare).toHaveBeenCalledWith("Valid123", "Hashedpassword1234")
        expect(jwt.sign).toHaveBeenCalled()

        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBe("faketoken123")
        expect(res.body.user).toEqual(fakeUser)
    })

    it("devrait retourner une erreur 400 si email ou password manquant", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "" })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Email and password are required" })
    })

    it("devrait retourner une erreur 400 si l'utilisateur n'existe pas", async () => {
        Users.findOne = jest.fn().mockResolvedValue(null)

        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@test.com", password: "Valid123" })

        expect(Users.findOne).toHaveBeenCalledWith({ email: "test@test.com" })
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Invalid login credentials" })
    })

    it("devrait retourner une erreur 400 si le mot de passe est incorrect", async () => {
        Users.findOne = jest.fn().mockResolvedValue({
            _id: "123",
            email: "test@test.com",
            password: "hashedpassword",
            role: "user"
        })

        bcrypt.compare.mockResolvedValue(false)

        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@test.com", password: "wrongpass" })

        expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashedpassword")
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: "Invalid login credentials" })
    })

    it("devrait retourner une erreur 500", async () => {
        Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"))

        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@test.com", password: "Valid123" })

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "Error when trying to login user" })
    })
})

jest.mock('../middlewares/auth', () => {
    return jest.fn((role) => (req, res, next) => {
        req.user = { userId: '691c3acbac9a25d133316b5c', role }
        next()
    })
})

describe("GET /api/users", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
  
    it("devrait retourner la liste des utilisateurs", async () => {
        const fakeUsers = [
            { _id: "1", email: "a@test.com", role: "user" },
            { _id: "2", email: "b@test.com", role: "admin" }
        ]

        Users.find = jest.fn().mockResolvedValue(fakeUsers)

        const res = await request(app).get("/api/users")

        expect(Users.find).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(fakeUsers)
    })

    it("devrait retourner une erreur 500", async () => {
        Users.find.mockRejectedValue(new Error("Database error"))

        const res = await request(app).get("/api/users")

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: "Error when trying to retreive users" })
    })
})