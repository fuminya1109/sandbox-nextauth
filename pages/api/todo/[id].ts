// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import type { Todos } from '@prisma/client';
import { prisma } from '../../../lib/prisma';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todos | Error>
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (typeof id === 'undefined' || isNaN(Number(id))) {
    res.status(400).json({ message: 'bad request' });
    return;
  }
  switch (req.method) {
    case 'GET':
      try {
        const todo = await prisma.todos.findUnique({
          where: { id: parseInt(id) },
        });
        if (todo) {
          res.status(200).json(todo);
        } else {
          res.status(400).json({ message: 'Not Found' });
        }
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(e);
          res.status(500).json({ message: 'error' });
        }
        throw e;
      }
      break;
    case 'PUT':
      const { text, completed } = req.body;
      try {
        const updateTodo = await prisma.todos.update({
          where: {
            id: parseInt(id),
          },
          data: {
            text,
            completed,
          },
        });
        if (updateTodo) {
          res.status(200).json(updateTodo);
        } else {
          res.status(400).json({ message: 'Not Found' });
        }
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(e);
          res.status(500).json({ message: 'error' });
        }
        throw e;
      }
      break;
    case 'DELETE':
      try {
        const deleteTodo = await prisma.todos.delete({
          where: {
            id: parseInt(id),
          },
        });
        console.log(deleteTodo);
        if (deleteTodo) {
          res.status(200).json(deleteTodo);
        } else {
          res.status(400).json({ message: 'Not Found' });
        }
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(e);
          res.status(500).json({ message: 'error' });
        }
        throw e;
      }
      break;
    default:
      console.log('error');
      res.status(500).json({ message: 'error' });
  }
}
