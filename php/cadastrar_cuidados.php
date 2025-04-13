<?php


header('Content-Type: application/json');

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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (
        isset($_POST["tipo_cuidado"]) &&
        isset($_POST["frequencia"]) &&
        isset($_POST["descricao"]) &&
        isset($_POST["id_animal"])
    ) {
        $tipo_cuidado = $_POST["tipo_cuidado"];
        $frequencia = $_POST["frequencia"];
        $descricao = $_POST["descricao"];
        $id_animal = intval($_POST["id_animal"]);

        $sql = "INSERT INTO cuidados (tipo_cuidado, frequencia, descricao, id_animal)
                VALUES (?, ?, ?, ?)";

        $stmt = $conexao->prepare($sql);
        $stmt->bind_param("sssi", $tipo_cuidado, $frequencia, $descricao, $id_animal);

        if ($stmt->execute()) {
            echo json_encode(["mensagem" => "Cuidado cadastrado com sucesso!"]);
        } else {
            http_response_code(500);
            echo json_encode(["mensagem" => "Erro ao cadastrar cuidado: " . $conexao->error]);
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["mensagem" => "Preencha todos os campos obrigatórios."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["mensagem" => "Método não permitido."]);
}

$conexao->close();
