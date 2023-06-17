// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Todos } from '@prisma/client';
import { prisma } from '../../lib/prisma';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todos[] | Todos | Error>
) {
  switch (req.method) {
    case 'GET':
      // return all todos.
      const todos = await prisma.todos.findMany({});
      res.status(200).json(todos);
      break;
    case 'POST':
      const reqTodo = Array.isArray(req.query.todo)
        ? req.query.todo[0]
        : req.query.todo;
      const newTodo = await prisma.todos.create({
        data: {
          text: reqTodo ? reqTodo : '',
          completed: false,
        },
      });
      if (newTodo) {
        res.status(200).json(newTodo);
      } else {
        res.status(400).json({ message: `Don't added` });
      }
      break;
    default:
      console.log('error');
      res.status(500).json({ message: 'error' });
  }
}
