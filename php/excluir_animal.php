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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? null;

  if ($id !== null) {
    $stmt = $conexao->prepare("DELETE FROM animal WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      echo json_encode(["mensagem" => "Animal excluído com sucesso!"]);
    } else {
      echo json_encode(["erro" => "Erro ao excluir animal."]);
    }
}
    $stmt->close();
} else {
    echo json_encode(["erro" => "Método inválido."]);
  }

?>