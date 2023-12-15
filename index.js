//carrega as configurações do arquivo .env para a memória
require("dotenv").config();

const dataBase = require("./dataBase");

//configurações do PORT no .env para port
const port = process.env.PORT;

//carrega biblioteca express (framework para criação de backend no node.js)
const express = require ("express");

const app = express();

app.use(express.json()); //responsavel por habilitar o .json principalmente para inserir dados

app.get("/", (req, res)=>{
    res.json({
        message: "Funcionando!"
    })
})

app.get("/pessoas/:id", async (req, res)=> {
    const pessoa = await dataBase.selectPessoa(req.params.id);
    res.json(pessoa);
})

app.get("/pessoas", async (req, res)=> {
    const pessoas = await dataBase.selectPessoas();
    res.json(pessoas);
})

app.post("/pessoas", async (req, res)=> {
    await dataBase.insertPessoa(req.body);
    res.sendStatus(201);//retorna status HTTP com sucesso em cadastrar
})

app.patch("/pessoas/:id", async (req, res)=> {
    //req.params.id é usado para pegar o id na url
    //req.body é usado para pegar os dados da pessoa no corpo da requisição
    await dataBase.updatePessoa(req.params.id, req.body);
    res.sendStatus(200);//retorna status HTTP com sucesso em editar
})

app.delete("/pessoas/:id", async (req, res)=> {
    await dataBase.deletePessoa(req.params.id);
    res.sendStatus(204);
})

//cria aplicação web
app.listen(port);
console.log("Backend rodando...");