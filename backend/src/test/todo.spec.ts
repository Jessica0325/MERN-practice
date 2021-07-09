import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import * as E from 'fp-ts/Either'
import { ITodo } from '../types/todo'
import { constTrue } from 'fp-ts/lib/function'

describe('Form test', () => {
    let server: FastifyInstance<Server, IncomingMessage, ServerResponse>

    beforeAll(async () => {
        await dbHandler.connect()
        server = startFastify(8888)
    })

    afterEach(async () => {
        await dbHandler.clearDatabase()
    })

    afterAll(async () => {
        E.match(
            (e) => console.log(e),
            (_) => console.log('Closing Fastify server is done!')
        )(
            E.tryCatch(
                () => {
                    dbHandler.closeDatabase()
                    server.close((): void => { })
                },
                (reason) => new Error(`Failed to close a Fastify server, reason: ${reason}`)
            )
        )
    })    

    // TODO: Add some test cases like CRUD, i.e. get, post, update, delete
    it('get test',async()=>{
        const response = await server.inject({method:'GET',url:'/api/todos'})

        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(JSON.stringify({todos:[]}))
    })

    it('post test',async()=>{
        const response = await server.inject({
            method:'POST',
            url:'/api/todos',
            payload:{
                name:'post',
                description:'please success',
                status:false
            }
        })

        expect(response.statusCode).toBe(201)

        const getResponse = await server.inject({method:'GET',url:'/api/todos'})
        expect(getResponse.statusCode).toBe(200)
        const getRes :{todos:Array<ITodo>} = JSON.parse(getResponse.body)
        expect(getRes.todos.length).toBe(1)
        expect(getRes.todos[0].name).toBe('post')
        expect(getRes.todos[0].description).toBe('please success')
        expect(getRes.todos[0].status).toBe(false)
    })

    it('put test',async()=>{
        const response = await server.inject({
            method:'POST',
            url:'/api/todos',
            payload:{
                name:'put',
                description:'please',
                status:false
            }
        })

        expect(response.statusCode).toBe(201)
        const res :{todo:ITodo} = JSON.parse(response.body)
        console.log(`post Todo: ${res}`)
        const id = res.todo._id
        const updateByIdResponse = await server.inject({
            method: 'PUT',
            url: `/api/todos/${id}`,
            payload: {
                status: true
            }
        })
        expect(updateByIdResponse.statusCode).toBe(200)
        const res2: { todo: ITodo } = JSON.parse(updateByIdResponse.body)
        expect(res2.todo.name).toBe('put')
        expect(res2.todo.description).toBe('please')
        expect(res2.todo.status).toBe(true)
    })

    it('delete test', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/todos',
            payload: {
                name: 'delete',
                description: 'success',
                status: false
            }
        })

        const res: { todo: ITodo } = JSON.parse(response.body)

        const id = res.todo._id
        const deleteByIdResponse = await server.inject({
            method: 'DELETE',
            url: `/api/todos/${id}`
        })
        expect(deleteByIdResponse.statusCode).toBe(204)
    })

})
