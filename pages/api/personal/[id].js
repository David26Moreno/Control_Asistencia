import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
export default async function handler(req, res) {
    const {method, body, query:{id}} = req;
    let pers
    switch(method) {
        case "GET":
            pers = await prisma.personal.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    role: true,
                },
            });
            if(pers)res.json(pers)
            else res.status(404).json({message: "Not Found personal"})
            break;
        case "PUT":
            try {
                let roleId = {...body}.role;
                delete body.role
                pers = await prisma.personal.update({
                    where: {
                        id: Number(id),
                    },
                    data: {...body, roleId},
                    include: {
                        role: true,
                    },
                });
                res.json(pers);
            } catch (error) {
                console.log(error)
                res.json(error);
            }
            break;
        case "DELETE":
            pers = await prisma.personal.delete({
                where: {
                    id: Number(id),
                },
            });
            res.json(pers);
            break;
    }
}