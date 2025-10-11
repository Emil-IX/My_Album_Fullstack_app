import request from "supertest";
import app from "../server.js";



//authentication tests
describe("Auth users", () => {


    it("Register user", async () => {

        const res =await request(app)
            .post("/api/auth/register")
            .send({
                name:"QA3 user",
                email:"qa3user@test.com",
                password:"qa123456",
                age: 31
            })

            expect(res.statusCode).toBe(201)
            expect(res.body.message).toBe('User registered')
    })



      it("Login an return token", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "123456",
      age: 22,
    });

    const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "login@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });


  it("Do not allow repeat email", async () => {

    await request(app)
    .post("/api/auth/register")
    .send({
        name:"user1",
        email:"user@gmail.com",
        password:"123456",
        age: 22
     })

    const res = await request(app)
    .post("/api/auth/register")
     .send({
        name:"user2",
        email:"user@gmail.com",
        password:"123456",
        age: 22
     })

     expect(res.statusCode).toBe(400)
     expect(res.body.message).toBe('Email already exist')


  })



})