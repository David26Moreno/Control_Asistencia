import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
export default async function handler(req, res) {
    const {method, body, query:{id}} = req;
    let roll
    switch(method) {
        case "GET":
            roll = await prisma.role.findUnique({
                where: {
                    id: Number(id),
                }
            });
            if(roll)res.json(roll)
            else res.status(404).json({message: "Not Found Role"})
            break;
        case "PUT":
            try {
                roll = await prisma.role.update({
                    where: {
                        id: Number(id),
                    },
                    data: body
                });
                res.json(roll);
            } catch (error) {
                console.log(error)
                res.json(error);
            }
            break;
        case "DELETE":
            roll = await prisma.role.delete({
                where: {
                    id: Number(id),
                },
            });
            res.json(roll);
            break;
    }
}