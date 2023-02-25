
import { Prisma, User } from '@prisma/client';
import express, {Express, Request, Response} from 'express';
const app : Express= express();
const PORT= process.env.PORT || 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createUserAndPost = (
  name: string,
  place?: string,
 ) => {
  return Prisma.validator<Prisma.UserCreateArgs>()({
   data:{
    name,
    place
   }
  })
}

const findSpecificUser = (id: string) => {
  return Prisma.validator<Prisma.UserFindUniqueArgsBase>()({
   where:{
    id:id
   }
  })
}

const updateSpecificUser=(id:string,name:string,place:string)=>{
  return Prisma.validator<Prisma.UserUpdateArgs>()({
    where: { id: id },
    data: {
      name:name,
    place:place
      }
  })
}
const deleteSpecificUser=(id:string)=>{
return Prisma.validator<Prisma.UserDeleteArgs>()({
  where: {
    id: id
  }
})
}
app.use(express.json());

//get all available users
app.get("/user", async (req:Request, res:Response) => {
  const allUsers:User = await prisma.user.findMany();
  res.json({
    data: allUsers,
  });
});

// //get user by id
app.get("/user/:id", async (req: Request, res: Response) => {
  const { id }= req.params ;
  const getUserById:User = await prisma.user.findUnique(
  findSpecificUser(id) 
    );
  if (!!getUserById) {
    res.json({
      data: getUserById,
    });
  } else {
    res.json({
      data: "Unable to find user with id:" + id,
    });
  }
});

 //create user
app.post("/user", async (req:Request, res:Response) => {
  const userName:string = req.body.name;
  const userPlace:string = req.body.place;
  // if (!userName || !userPlace) {
  //   return res.status(400).json({ message: "Either name or place is missing" });
  // }
  try {
    const userData:User = await prisma.user.create(
      createUserAndPost(userName,userPlace)
    );
    return res.json({ userData });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "something went wrong" });
  }
});

// //update a user
app.put("/user/:id", async (req:Request, res:Response) => {

  const { id }= req.params;
  const { name, place } = req.body ;
  try {
      const post:User = await prisma.user.update(updateSpecificUser(id,name,place));
      res.json(post);
  } catch (error) {
    res.json({ error: `User with ID ${id} does not exist in the database` });
  }
});

// //delete a user
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser:User = await prisma.user.delete(deleteSpecificUser(id));
    if (!!deleteUser) {
      res.json({ data: "Sucessfully deleted user with id: " + id });
    }
  } catch (error) {
    res.json({ error: `User with ID ${id} does not exist in the database` });
  }
});
const server = app.listen(PORT, () =>
  console.log("Server running at: http://localhost:"+PORT)
);
