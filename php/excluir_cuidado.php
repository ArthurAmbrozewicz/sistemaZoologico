<?php
header('Content-Type: application/json');

$host = "localhost:3306";
$usuario = "root";
$senha = "";
$database = "zoologico";

$conexao = new mysqli($host, $usuario, $senha, $database);


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = $conexao->real_escape_string($_POST['id']);
    $sql = "DELETE FROM cuidados WHERE id = '$id'";

    if ($conexao->query($sql)) {
        echo json_encode(["mensagem" => "Cuidado excluído com sucesso"]);
    } else {
        echo json_encode(["erro" => "Erro ao excluir cuidado: " . $conexao->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["erro" => "Requisição inválida"]);
}

$conexao->close();
?>
