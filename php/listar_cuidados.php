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

$sql = "SELECT c.tipo_cuidado, a.nome , c.frequencia, c.id,c.descricao
        FROM cuidados c 
        JOIN animal a ON c.id_animal = a.id";

$resultado = $conexao->query($sql);

$cuidados = [];
while ($linha = $resultado->fetch_assoc()) {
    $cuidados[] = $linha;
}

echo json_encode($cuidados);

$conexao->close();
?>
