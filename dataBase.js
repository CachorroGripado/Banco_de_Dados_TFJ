//Pedro Felipe Ataide de Almeida - Código

async function connect(){

    if(global.connection)
    return global.connection.connect();

    const {Pool} = require("pg");
    const pool = new Pool ({
        connectionString:process.env.CONNECTION_STRING
    });

    const client = await pool.connect();//cria conexão com banco de dados
    console.log("Criou o pool de conexão");

    //testando se a conexão do banco está correta
    //linha abaixo usa "select now()" que pega a hora do banco de dados
    const res = await client.query("select now()");
    //a hora do banco de dados vêm em um array, usamos a propiedade rows pra pegar 
    //o primeiro indice di array
    console.log(res.rows[0]);
    client.release();//libera a conexão

    global.connection = pool;
    return pool.connect();
}

connect();

async function selectPessoas(){
    const client = await connect();
    const res= await client.query("SELECT * FROM pessoas");
    return res.rows;
}

async function selectPessoa(id){
    const client = await connect();
    const res= await client.query("SELECT * FROM pessoas WHERE ID=$1", [id]);
    return res.rows;
}

async function insertPessoa(pessoa){
    const client = await connect();
    const sql = "INSERT INTO pessoas (nome,cpf,data_nascimento,telefone,endereco,altura,peso)VALUES ($1,$2,$3,$4,$5,$6,$7)";
    const values = [pessoa.nome, pessoa.cpf, pessoa.data_nascimento, pessoa.telefone, pessoa.endereco, pessoa.altura, pessoa.peso];
    await client.query(sql,values);
    // tiramos res. e return porque o insert não retornada nada 
}

async function updatePessoa(id,pessoa){
    const client = await connect();
    const sql = "UPDATE pessoas SET nome=$1,cpf=$2,data_nascimento=$3,telefone=$4,endereco=$5,altura=$6,peso=$7 WHERE id=$8";
    const values = [pessoa.nome, pessoa.cpf, pessoa.data_nascimento, pessoa.telefone, pessoa.endereco, pessoa.altura, pessoa.peso, id];
    await client.query(sql,values);    
}

async function deletePessoa(id){
    const client = await connect();
    const sql = "DELETE FROM pessoas WHERE id=$1";
    const values = [id];
    await client.query(sql,values);    
}

module.exports = {
    selectPessoas,
    selectPessoa,
    insertPessoa,
    updatePessoa,
    deletePessoa
}