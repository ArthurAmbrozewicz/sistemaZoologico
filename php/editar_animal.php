<?php
$host = "localhost:3306";
$usuario = "root";
$senha = "";
$database = "zoologico";

$conexao = new mysqli($host, $usuario, $senha, $database);
if ($conexao->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na conexão: " . $conexao->connect_error]);
    exit;
}

header('Content-Type: application/json');

if (
    isset($_POST['id'], $_POST['nome'], $_POST['descricao'], $_POST['data_nascimento'],
    $_POST['especie'], $_POST['habitat'], $_POST['pais_origem'])
) {
    $id = intval($_POST['id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $data = trim($_POST['data_nascimento']);
    $especie = trim($_POST['especie']);
    $habitat = trim($_POST['habitat']);
    $pais = trim($_POST['pais_origem']);

    $stmt = $conexao->prepare("UPDATE animal SET nome = ?, descricao = ?, data_nascimento = ?, especie = ?, habitat = ?, pais_origem = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("ssssssi", $nome, $descricao, $data, $especie, $habitat, $pais, $id);
        if ($stmt->execute()) {
            echo json_encode(['mensagem' => 'Animal atualizado com sucesso.']);
        } else {
            echo json_encode(['erro' => 'Erro ao atualizar o animal.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['erro' => 'Erro ao preparar a query.']);
    }
} else {
    echo json_encode(['erro' => 'Dados incompletos.']);
}

$conexao->close();
