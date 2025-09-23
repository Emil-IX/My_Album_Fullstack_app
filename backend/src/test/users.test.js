import request from "supertest";
import app from "../server.js";
import { User } from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


let token

beforeAll( async() => {

    await User.deleteMany()

    const hashedPassword = await bcrypt.hash('Admin123', 10)

    const adminUser = await User.create({
        name: "Admin user",
        email:"adminuser@gmail.com",
        password: hashedPassword,
        age: 30,
        role: "admin"
    })


    token = jwt.sign(
        {id: adminUser._id, role: 'admin'},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

})


describe("users tests", () =>{

    it('List users', async ()=> {

        const res = await request(app)
        .get("/api/users")
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

    })

     it("Debería crear un usuario como admin", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "New User",
        email: "newuser@test.com",
        password: "123456",
        age: 20,
        role: "admin",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe("admin");
  });


  it("Age should be uptated",async () => {

        const user = await User.create({
            name:'Flawers',
            email:'flawers@gmail.com',
            password:'1234567',
            age: '14',
        })

        const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ age: 31 });

      expect(res.statusCode).toBe(200);
      expect(res.body.age).toBe(31);


  })


  it("Debería eliminar un usuario", async () => {
    const user = await User.create({
      name: "Delete Me",
      email: "delete@test.com",
      password: "123456",
      age: 30,
      role: "user",
    });

    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("delete@test.com");
  });



})