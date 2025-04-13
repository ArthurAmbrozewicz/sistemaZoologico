<?php
$host = "localhost:3306";
$usuario = "root";
$senha = "";
$database = "zoologico";

header('Content-Type: application/json');

$conexao = new mysqli($host, $usuario, $senha, $database);
if ($conexao->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na conexão: " . $conexao->connect_error]);
    exit;
}

$campos = ['nome', 'descricao', 'data_nascimento', 'especie', 'habitat', 'pais_origem'];
foreach ($campos as $campo) {
    if (!isset($_POST[$campo])) {
        http_response_code(400);
        echo json_encode(["erro" => "Campo obrigatório ausente: $campo"]);
        exit;
    }
}

$nome = $_POST['nome'];
$descricao = $_POST['descricao'];
$data_nascimento = $_POST['data_nascimento'];
$especie = $_POST['especie'];
$habitat = $_POST['habitat'];
$pais_origem = $_POST['pais_origem'];

$sql = "INSERT INTO animal (nome, descricao, data_nascimento, especie, habitat, pais_origem)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao preparar statement: " . $conexao->error]);
    exit;
}

$stmt->bind_param("ssssss", $nome, $descricao, $data_nascimento, $especie, $habitat, $pais_origem);

if ($stmt->execute()) {
    echo json_encode(["mensagem" => "Animal cadastrado com sucesso!"]);
} else {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao cadastrar animal: " . $stmt->error]);
}

$stmt->close();
$conexao->close();
?>
