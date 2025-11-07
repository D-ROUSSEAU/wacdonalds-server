const request = require("supertest")
const app = require("../index")
const Menus = require("../models/menu.model")

jest.mock("../models/menu.model")

describe("GET /api/menus", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("devrait retourner la liste des menus", async () => {
        const fakeMenus = [
            { name: "Menu 1", price: 10 },
            { name: "Menu 2", price: 15 },
        ]
        Menus.find.mockResolvedValue(fakeMenus)

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
