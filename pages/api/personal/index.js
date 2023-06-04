import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
    const prisma = new PrismaClient()
    if (req.method === 'GET') {
        const person = await prisma.personal.findMany({
			include: {
				role: true,
			},
		});
        res.json(person);
    }else if( req.method === 'POST'){
        const pers = await prisma.personal.create({
			data: {...req.body, 
                role: {
                    connect: {
                        id: req.body.role
                    }
                }
            },
            include: {
                role: true,
            },
		});
        res.json(pers);
    }
}