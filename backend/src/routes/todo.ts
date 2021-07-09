import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { ITodo } from '../types/todo'
import { TodoRepoImpl } from './../repo/todo-repo'

const TodoRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {

    const todoRepo = TodoRepoImpl.of()

    interface IdParam {
        id: string
    }

    // TODO: Add CRUD endpoints, i.e. get, post, update, delete
    // NOTE: the url should be RESTful
    server.get('/todos',opts,async(request,reply)=>{
        try{
            const todos:Array<ITodo> = await todoRepo.getTodos()
            return reply.status(200).send({todos})
        }catch(error){
            console.log(`GET \todos Error ${error}`)
            return reply.status(500).send(`[Server Error] : ${error}`)
        }
    })

    server.post('/todos',opts,async(request,reply)=>{
        try{
            const todoBody:ITodo = request.body as ITodo
            const todos:ITodo = await todoRepo.addTodo(todoBody)
            return reply.status(201).send({todos})
        }catch(error){
            console.log(`POST \todos Error ${error}`)
            return reply.status(500).send(`[Server Error] : ${error}`)
        }
    })

    server.put<{Params:IdParam}>('/todos/:id',opts,async(request,reply)=>{
        try{
            const todoBody:ITodo = request.body as ITodo
            const id:string = request.params.id
            const todos:ITodo|null = await todoRepo.updateTodo(id,todoBody)
            if(todos){
                return reply.status(200).send({todos})
            }else{
                return reply.status(404).send({ msg: `Not Found Todo:${id}` })
            }
            
        }catch(error){
            console.log(`PUT \todos Error ${error}`)
            return reply.status(500).send(`[Server Error] : ${error}`)
        }
    })

    server.delete<{Params:IdParam}>('/todos/:id',opts,async(request,reply)=>{
        try{
            const id:string = request.params.id
            const todos:ITodo|null = await todoRepo.deleteTodo(id)
            if (todos) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `Not Found Todo:${id}` })
            }
        }catch(error){
            console.log(`DELETE \todos Error ${error}`)
            return reply.status(500).send(`[Server Error] : ${error}`)
        }
    })

    done()
}

export { TodoRouter }
