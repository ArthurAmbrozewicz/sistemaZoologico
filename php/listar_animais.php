<?php
header('Content-Type: application/json');

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

$sql = "SELECT id, nome, descricao, pais_origem, data_nascimento, especie, habitat FROM animal";
$resultado = $conexao->query($sql);

$animais = [];
while ($linha = $resultado->fetch_assoc()) {
    $animais[] = $linha;
}

echo json_encode($animais);

$conexao->close();
?>
