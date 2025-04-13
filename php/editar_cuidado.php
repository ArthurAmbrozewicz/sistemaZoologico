<?php

$host = "localhost:3306";
$usuario = "root";
$senha = "";
$database = "zoologico";

$conexao = new mysqli($host, $usuario, $senha, $database);
if ($conexao->connect_error) {
    http_response_code(500);
    echo json_encode(["mensagem" => "Erro na conexão: " . $conexao->connect_error]);
    exit;
}

header('Content-Type: application/json');

if (isset($_POST['id'], $_POST['tipo_cuidado'], $_POST['frequencia'], $_POST['descricao'])) {
    
    $id = intval($_POST['id']);
    $tipo_cuidado = trim($_POST['tipo_cuidado']);
    $frequencia = trim($_POST['frequencia']);
    $descricao = trim($_POST['descricao']);

    // Validação básica
    if ($tipo_cuidado === '' || $frequencia === '') {
        echo json_encode(['erro' => 'Todos os campos são obrigatórios.']);
        exit;
    }

    $stmt = $conexao->prepare("UPDATE cuidados SET tipo_cuidado = ?, frequencia = ?, descricao = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("sssi", $tipo_cuidado, $frequencia,$descricao,$id);
        if ($stmt->execute()) {
            echo json_encode(['mensagem' => 'Cuidado atualizado com sucesso.']);
        } else {
            echo json_encode(['erro' => 'Erro ao atualizar o cuidado.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['erro' => 'Erro ao preparar a query.']);
    }
} else {
    echo json_encode(['erro' => 'Dados incompletos.']);
}

$conexao->close();
