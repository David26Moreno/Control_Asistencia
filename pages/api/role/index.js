import { PrismaClient} from "@prisma/client";

export default async (req, res) => {
    const prisma = new PrismaClient()
    if (req.method === 'GET') {
        const person = await prisma.role.findMany();
        res.json(person);
    }else if( req.method === 'POST'){
        const pers = await prisma.role.create({
			data: req.body,
		});
        res.json(pers);
    }
}