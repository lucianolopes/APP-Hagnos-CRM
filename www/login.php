<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/html; charset=UTF-8");
include("dados/conexao.php");

$login = $_GET['uid'];
$senha = $_GET['pass'];
$sqlu = mysql_query("select id, apelido, email, senha, nome, tipo, nometipo, codrep, codcli, status from usuarios where email = '".$login."' or apelido = '".$login."' ");
$d = mysql_fetch_assoc($sqlu);
if (mysql_num_rows($sqlu) == 0){
	echo "0";
} else {
	if ($d['senha'] != md5($senha)){
		echo "1";
	} else {		
		
		//echo utf8_encode($d['nome']);
		$arr = array();
		$arr[] = array(
					'id' => $d['id'],
					'rep' => $d['codrep'], 
					'cli' => $d['codcli'], 
					'apelido' => utf8_encode($d['apelido']),
					'email' => $d['email'], 
					'nome' => utf8_encode($d['nome']), 
					'tipo' => $d['tipo'],
					'nometipo' => utf8_encode($d['nometipo']),
					'status' => $d['status']
					);
		echo json_encode($arr);

				
	}
}

?>