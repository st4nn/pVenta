<?
	$rutaClaseConexionMySQL = '../../server/php/conectar.php';
	$rutaClaseSMTP = '../../assets/mensajes/correo.php';
	$rSQL = "SELECT idLogin, Nombre FROM datosUsuarios WHERE Correo = '_Correo';";
	$cSQL = "";
	$url = "http://lineadfuego.com/posventa";
	$nomApp = "Linea D Fuego";
?>